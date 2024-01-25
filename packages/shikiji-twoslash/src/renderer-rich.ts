import type { Element, ElementContent, Text } from 'hast'
import type { ShikijiTransformerContextCommon } from 'shikiji-core'
import type { NodeHover, NodeQuery } from 'twoslash'
import type { TwoslashRenderer } from './types'
import type { CompletionItem } from './icons'
import { defaultCompletionIcons, defaultCustomTagIcons } from './icons'

export interface RendererRichOptions {
  /**
   * Render JSDoc comments in hover popup.
   *
   * @default true
   */
  jsdoc?: boolean

  /**
   * Custom icons for completion items.
   * A map from completion item kind to a HAST node.
   *
   * If `false`, no icons will be rendered.
   * @default defaultCompletionIcons
   */
  completionIcons?: Partial<Record<CompletionItem['kind'], ElementContent>> | false

  /**
   * Custom icons for custom tags lines.
   * A map from tag name to a HAST node.
   *
   * If `false`, no icons will be rendered.
   * @default defaultCustomTagIcons
   */
  customTagIcons?: Partial<Record<string, ElementContent>> | false

  /**
   * Custom formatter for the type info text.
   * Note that it might not be valid TypeScript syntax.
   *
   * @default defaultHoverInfoProcessor
   */
  processHoverInfo?: (info: string) => string

  /**
   * Custom formatter for the docs text (can be markdown).
   *
   * @default undefined
   */
  processHoverDocs?: (docs: string) => string

  /**
   * Classes added to injected elements
   */
  classExtra?: string

  /**
   * Language for syntax highlight.
   * @default the language of the code block
   */
  lang?: string

  /**
   * @deprecated Use `processHoverInfo` instead.
   */
  formatInfo?(info: string): string

  /**
   * Custom function to render markdown.
   *
   * By default it pass-through the markdown.
   */
  renderMarkdown?(this: ShikijiTransformerContextCommon, markdown: string): ElementContent[]

  /**
   * Custom function to render inline markdown.
   *
   * By default it pass-through the markdown.
   */
  renderMarkdownInline?(this: ShikijiTransformerContextCommon, markdown: string): ElementContent[]

  /**
   * Extensions for the genreated HAST tree.
   */
  hast?: {
    /**
     * The <code> block for in the hover popup.
     */
    popupTypes?: HastExtension
    /**
     * The documentation block in the hover popup. Can be markdown rendered if `renderMarkdown` is provided.
     */
    popupDocs?: HastExtension
    /**
     * The container of jsdoc tags in the hover popup.
     */
    popupDocsTags?: HastExtension
    /**
     * The token for the hover informaton.
     */
    hoverToken?: HastExtension
    /**
     * The container of the hover popup.
     */
    hoverPopup?: HastExtension
    /**
     * Custom function to compose the hover token.
     */
    hoverCompose?: (parts: { popup: Element, token: Text | Element }) => ElementContent[]
    /**
     * The token for the query informaton.
     */
    queryToken?: HastExtension
    /**
     * The container of the query popup.
     */
    queryPopup?: HastExtension
    /**
     * Custom function to compose the hover token.
     */
    queryCompose?: (parts: { popup: Element, token: Text | Element }) => ElementContent[]
    /**
     * The token for the completion informaton.
     */
    completionToken?: HastExtension
    /**
     * The cursor element in the completion popup.
     */
    completionCursor?: HastExtension
    /**
     * The container of the completion popup.
     */
    completionPopup?: HastExtension
    /**
     * Custom function to compose the completion token.
     */
    completionCompose?: (parts: { popup: Element, cursor: Element }) => ElementContent[]
    /**
     * The token for the error informaton.
     */
    errorToken?: HastExtension
    /**
     * The wrapper for the highlighted nodes.
     */
    nodesHighlight?: HastExtension
  }
}

export interface HastExtension {
  tagName?: string
  properties?: Element['properties']
  class?: string
  children?: (input: ElementContent[]) => ElementContent[]
}

function extend(extension: HastExtension | undefined, node: Element): Element {
  if (!extension)
    return node
  return {
    ...node,
    tagName: extension.tagName ?? node.tagName,
    properties: {
      ...node.properties,
      class: extension.class || node.properties?.class,
      ...extension.properties,
    },
    children: extension.children?.(node.children) ?? node.children,
  }
}

function renderMarkdownPassThrough(markdown: string): ElementContent[] {
  return [
    {
      type: 'text',
      value: markdown,
    },
  ]
}

/**
 * An alternative renderer that providers better prefixed class names,
 * with syntax highlight for the info text.
 */
export function rendererRich(options: RendererRichOptions = {}): TwoslashRenderer {
  const {
    completionIcons = defaultCompletionIcons,
    customTagIcons = defaultCustomTagIcons,
    formatInfo,
    processHoverInfo = formatInfo || defaultHoverInfoProcessor,
    processHoverDocs = docs => docs,
    classExtra = '',
    jsdoc = true,
    renderMarkdown = renderMarkdownPassThrough,
    renderMarkdownInline = renderMarkdownPassThrough,
    hast,
  } = options

  function highlightPopupContent(
    this: ShikijiTransformerContextCommon,
    info: NodeHover | NodeQuery,
  ) {
    if (!info.text)
      return []
    const content = processHoverInfo(info.text)
    if (!content || content === 'any')
      return []

    const popupContents: ElementContent[] = []

    const typeCode = ((this.codeToHast(
      content,
      {
        ...this.options,
        transformers: [],
        lang: (this.options.lang === 'tsx' || this.options.lang === 'jsx')
          ? 'tsx'
          : 'ts',
      },
    ).children[0] as Element).children as Element[])[0]
    typeCode.properties.class = 'twoslash-popup-code'

    popupContents.push(
      extend(
        hast?.popupTypes,
        typeCode,
      ),
    )

    if (jsdoc && info.docs) {
      const docs = processHoverDocs(info.docs) ?? info.docs
      if (docs) {
        const children = renderMarkdown.call(this, docs)
        popupContents.push(extend(
          hast?.popupDocs,
          {
            type: 'element',
            tagName: 'div',
            properties: { class: 'twoslash-popup-docs' },
            children,
          },
        ))
      }
    }

    if (jsdoc && info.tags?.length) {
      popupContents.push(extend(
        hast?.popupDocsTags,
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: 'twoslash-popup-docs twoslash-popup-docs-tags',
          },
          children: info.tags.map(tag => (<Element>{
            type: 'element',
            tagName: 'span',
            properties: {
              class: `twoslash-popup-docs-tag`,
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  class: 'twoslash-popup-docs-tag-name',
                },
                children: [
                  {
                    type: 'text',
                    value: `@${tag[0]}`,
                  },
                ],
              },
              ...tag[1]
                ? [
                    <Element>{
                      type: 'element',
                      tagName: 'span',
                      properties: {
                        class: 'twoslash-popup-docs-tag-value',
                      },
                      children: renderMarkdownInline.call(this, tag[1]),
                    },
                  ]
                : [],
            ],
          })),
        },
      ))
    }

    return popupContents
  }

  return {
    nodeStaticInfo(info, node) {
      const themedContent = highlightPopupContent.call(this, info)

      if (!themedContent.length)
        return node

      const popup = extend(
        hast?.hoverPopup,
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: ['twoslash-popup-container', classExtra].filter(Boolean).join(' '),
          },
          children: themedContent,
        },
      )

      return extend(
        hast?.hoverToken,
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'twoslash-hover',
          },
          children: hast?.hoverCompose
            ? hast?.hoverCompose({ popup, token: node })
            : [popup, node],
        },
      )
    },

    nodeQuery(query, node) {
      if (!query.text)
        return {}

      const themedContent = highlightPopupContent.call(this, query)

      const popup = extend(
        hast?.queryPopup,
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: ['twoslash-popup-container', classExtra].filter(Boolean).join(' '),
          },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { class: 'twoslash-popup-arrow' },
              children: [],
            },
            ...themedContent,
          ],
        },
      )

      return extend(
        hast?.queryToken,
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'twoslash-hover twoslash-query-presisted',
          },
          children: hast?.queryCompose
            ? hast?.queryCompose({ popup, token: node })
            : [popup, node],
        },
      )
    },

    nodeCompletion(query, node) {
      if (node.type !== 'text')
        throw new Error(`[shikiji-twoslash] nodeCompletion only works on text nodes, got ${node.type}`)

      const items: Element[] = query.completions
        .map(i => ({
          type: 'element',
          tagName: 'li',
          properties: {},
          children: [
            ...completionIcons
              ? [<Element>{
                type: 'element',
                tagName: 'span',
                properties: { class: `twoslash-completions-icon completions-${i.kind.replace(/\s/g, '-')}` },
                children: [
                  completionIcons[i.kind] || completionIcons.property,
                ].filter(Boolean),
              }]
              : [],
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: i.kindModifiers?.split(',').includes('deprecated')
                  ? 'deprecated'
                  : undefined,
              },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { class: 'twoslash-completions-matched' },
                  children: [
                    {
                      type: 'text',
                      value: i.name.startsWith(query.completionsPrefix)
                        ? query.completionsPrefix
                        : '',
                    },
                  ],
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { class: 'twoslash-completions-unmatched' },
                  children: [
                    {
                      type: 'text',
                      value: i.name.startsWith(query.completionsPrefix)
                        ? i.name.slice(query.completionsPrefix.length || 0)
                        : i.name,
                    },
                  ],
                },
              ],
            },
          ],
        }))

      const cursor = extend(
        hast?.completionCursor,
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: ['twoslash-completion-cursor', classExtra].filter(Boolean).join(' '),
          },
          children: [],
        },
      )

      const popup = extend(
        hast?.completionPopup,
        {
          type: 'element',
          tagName: 'ul',
          properties: {
            class: ['twoslash-completion-list', classExtra].filter(Boolean).join(' '),
          },
          children: items,
        },
      )

      const children: ElementContent[] = []
      if (node.value)
        children.push({ type: 'text', value: node.value })

      if (hast?.completionCompose) {
        children.push(...hast.completionCompose({ popup, cursor }))
      }
      else {
        children.push({
          ...cursor,
          children: [popup],
        })
      }

      return extend(
        hast?.completionToken,
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children,
        },
      )
    },

    nodeError(_, node) {
      return extend(
        hast?.errorToken,
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'twoslash-error',
          },
          children: [node],
        },
      )
    },

    lineError(error) {
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: ['twoslash-meta-line twoslash-error-line', classExtra].filter(Boolean).join(' '),
          },
          children: [
            {
              type: 'text',
              value: error.text,
            },
          ],
        },
      ]
    },

    lineCustomTag(tag) {
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: [`twoslash-tag-line twoslash-tag-${tag.name}-line`, classExtra].filter(Boolean).join(' '),
          },
          children: [
            ...customTagIcons
              ? [<Element>{
                type: 'element',
                tagName: 'span',
                properties: { class: `twoslash-tag-icon tag-${tag.name}-icon` },
                children: [
                  customTagIcons[tag.name],
                ].filter(Boolean),
              }]
              : [],
            {
              type: 'text',
              value: tag.text || '',
            },
          ],
        },
      ]
    },

    nodesHighlight(highlight, nodes) {
      return [
        extend(
          hast?.nodesHighlight,
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'twoslash-highlighted',
            },
            children: nodes,
          },
        ),
      ]
    },
  }
}

const regexType = /^[A-Z][a-zA-Z0-9_]*(\<[^\>]*\>)?:/
const regexFunction = /^[a-zA-Z0-9_]*\(/

/**
 * The default hover info processor, which will do some basic cleanup
 */
export function defaultHoverInfoProcessor(type: string) {
  let content = type
    // remove leading `(property)` or `(method)` on each line
    .replace(/^\(([\w-]+?)\)\s+/mg, '')
    // remove import statement
    .replace(/\nimport .*$/, '')
    // remove interface or namespace lines with only the name
    .replace(/^(interface|namespace) \w+$/mg, '')
    .trim()

  // Add `type` or `function` keyword if needed
  if (content.match(regexType))
    content = `type ${content}`
  else if (content.match(regexFunction))
    content = `function ${content}`

  return content
}
