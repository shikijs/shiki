import type { ShikiTransformerContextCommon } from '@shikijs/types'
import type { Element, ElementContent, Text } from 'hast'
import type { NodeError, NodeHover, NodeQuery } from 'twoslash'
import type { TwoslashRenderer } from './types'
import { ShikiTwoslashError } from './error'
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
  completionIcons?: Partial<Record<string, ElementContent>> | false

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
   * The way errors should be rendered.
   *
   * - `'line'`: Render the error line after the line of code
   * - `'hover'`: Render the error in the hover popup
   *
   * @default 'line'
   */
  errorRendering?: 'line' | 'hover'

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
   * Custom function to render markdown.
   *
   * By default it pass-through the markdown.
   */
  renderMarkdown?: (this: ShikiTransformerContextCommon, markdown: string) => ElementContent[]

  /**
   * Custom function to render inline markdown.
   *
   * By default it pass-through the markdown.
   */
  renderMarkdownInline?: (this: ShikiTransformerContextCommon, markdown: string, context: string) => ElementContent[]

  /**
   * The way query should be rendered.
   * - `'popup'`: Render the query in the absolute popup
   * - `'line'`: Render the query line after the line of code
   * @default 'popup'
   */
  queryRendering?: 'popup' | 'line'

  /**
   * Extensions for the generated HAST tree.
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
     * The container of error popup.
     */
    popupError?: HastExtension
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
     * The container of the error popup.
     * Only used when `errorRendering` is set to `'hover'`.
     */
    errorPopup?: HastExtension
    /**
     * Custom function to compose the error token.
     * Only used when `errorRendering` is set to `'hover'`.
     */
    errorCompose?: (parts: { popup: Element, token: Text | Element }) => ElementContent[]
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
    processHoverInfo = defaultHoverInfoProcessor,
    processHoverDocs = docs => docs,
    classExtra = '',
    jsdoc = true,
    errorRendering = 'line',
    queryRendering = 'popup',
    renderMarkdown = renderMarkdownPassThrough,
    renderMarkdownInline = renderMarkdownPassThrough,
    hast,
  } = options

  function highlightPopupContent(
    this: ShikiTransformerContextCommon,
    info: NodeHover | NodeQuery,
  ): ElementContent[] {
    if (!info.text)
      return []
    const content = processHoverInfo(info.text)
    if (!content || content === 'any')
      return []

    const popupContents: ElementContent[] = []

    let lang = this.options.lang
    if (lang === 'jsx')
      lang = 'tsx'
    else if (lang === 'js' || lang === 'javascript')
      lang = 'ts'

    const typeCode: Element = {
      type: 'element',
      tagName: 'code',
      properties: {},
      children: this.codeToHast(
        content,
        {
          ...this.options,
          meta: {},
          transformers: [],
          lang,
          structure: content.trim().includes('\n') ? 'classic' : 'inline',
        },
      ).children as ElementContent[],
    }
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
                      children: renderMarkdownInline.call(this, tag[1], `tag:${tag[0]}`),
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

      if (queryRendering !== 'popup') {
        return extend(
          hast?.queryToken,
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'twoslash-hover',
            },
            children: [
              node,
            ],
          },
        )
      }

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
            class: 'twoslash-hover twoslash-query-persisted',
          },
          children: hast?.queryCompose
            ? hast?.queryCompose({ popup, token: node })
            : [popup, node],
        },
      )
    },

    nodeCompletion(query, node) {
      if (node.type !== 'text')
        throw new ShikiTwoslashError(`Renderer hook nodeCompletion only works on text nodes, got ${node.type}`)

      const items: Element[] = query
        .completions
        .map((i) => {
          const kind = i.kind || 'default'
          const isDeprecated = 'kindModifiers' in i && typeof i.kindModifiers === 'string' && i.kindModifiers?.split(',').includes('deprecated')
          return {
            type: 'element',
            tagName: 'li',
            properties: {},
            children: [
              ...completionIcons
                ? [<Element>{
                  type: 'element',
                  tagName: 'span',
                  properties: { class: `twoslash-completions-icon completions-${kind.replace(/\s/g, '-')}` },
                  children: [
                    completionIcons[kind] || completionIcons.property,
                  ].filter(Boolean),
                }]
                : [],
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  class: isDeprecated
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
          }
        })

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

    nodesError(error, children) {
      if (errorRendering !== 'hover') {
        return [
          extend(
            hast?.errorToken,
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: [`twoslash-error`, getErrorLevelClass(error)].filter(Boolean).join(' '),
              },
              children,
            },
          ),
        ]
      }

      const popup = extend(
        hast?.errorPopup,
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: ['twoslash-popup-container', classExtra].filter(Boolean).join(' '),
          },
          children: [
            extend(
              hast?.popupError,
              {
                type: 'element',
                tagName: 'div',
                properties: {
                  class: 'twoslash-popup-error',
                },
                children: renderMarkdown.call(this, error.text),
              },
            ),
          ],
        },
      )

      const token: Element = {
        type: 'element',
        tagName: 'span',
        children,
        properties: {},
      }

      return [
        extend(
          hast?.errorToken,
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: `twoslash-error twoslash-error-hover ${getErrorLevelClass(error)}`,
            },
            children: hast?.errorCompose
              ? hast?.errorCompose({ popup, token })
              : [popup, token],
          },
        ),
      ]
    },

    lineQuery(query, node) {
      if (queryRendering !== 'line')
        return []

      const themedContent = highlightPopupContent.call(this, query)
      const targetNode = node?.type === 'element' ? node.children[0] : undefined
      const targetText = targetNode?.type === 'text' ? targetNode.value : ''
      const offset = Math.max(0, (query.character || 0) + Math.floor(targetText.length / 2) - 2)

      return [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: ['twoslash-meta-line twoslash-query-line', classExtra].filter(Boolean).join(' '),
          },
          children: [
            { type: 'text', value: ' '.repeat(offset) },
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
          ],
        },
      ]
    },

    lineError(error) {
      if (errorRendering !== 'line')
        return []
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: ['twoslash-meta-line twoslash-error-line', getErrorLevelClass(error), classExtra].filter(Boolean).join(' '),
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

const regexType = /^[A-Z]\w*(<[^>]*>)?:/
const regexFunction = /^\w*\(/

/**
 * The default hover info processor, which will do some basic cleanup
 */
export function defaultHoverInfoProcessor(type: string): string {
  let content = type
    // remove leading `(property)` or `(method)` on each line
    .replace(/^\(([\w-]+)\)\s+/gm, '')
    // remove import statement
    .replace(/\nimport .*$/, '')
    // remove interface or namespace lines with only the name
    .replace(/^(interface|namespace) \w+$/gm, '')
    .trim()

  // Add `type` or `function` keyword if needed
  if (content.match(regexType))
    content = `type ${content}`
  else if (content.match(regexFunction))
    content = `function ${content}`

  return content
}

function getErrorLevelClass(error: NodeError): string {
  switch (error.level) {
    case 'warning':
      return 'twoslash-error-level-warning'
    case 'suggestion':
      return 'twoslash-error-level-suggestion'
    case 'message':
      return 'twoslash-error-level-message'
    default:
      return ''
  }
}
