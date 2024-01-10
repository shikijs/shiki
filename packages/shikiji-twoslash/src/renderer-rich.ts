import type { Element, ElementContent } from 'hast'
import type { ShikijiTransformerContextCommon } from 'shikiji-core'
import type { TwoSlashRenderers } from './types'
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
}

/**
 * An alternative renderer that providers better prefixed class names,
 * with syntax highlight for the info text.
 */
export function rendererRich(options: RendererRichOptions = {}): TwoSlashRenderers {
  const {
    completionIcons = defaultCompletionIcons,
    customTagIcons = defaultCustomTagIcons,
    formatInfo,
    processHoverInfo = formatInfo || defaultHoverInfoProcessor,
    processHoverDocs = docs => docs,
    classExtra = '',
    jsdoc = true,
  } = options

  function hightlightPopupContent(
    codeToHast: ShikijiTransformerContextCommon['codeToHast'],
    shikijiOptions: ShikijiTransformerContextCommon['options'],
    info: { text?: string, docs?: string },
  ) {
    if (!info.text)
      return []

    const text = processHoverInfo(info.text) ?? info.text
    if (!text)
      return []

    const themedContent = ((codeToHast(text, {
      ...shikijiOptions,
      lang: options.lang || shikijiOptions.lang,
      transformers: [],
      transforms: undefined,
    }).children[0] as Element).children[0] as Element).children

    if (jsdoc && info.docs) {
      const docs = processHoverDocs(info.docs) ?? info.docs
      if (docs) {
        themedContent.push({
          type: 'element',
          tagName: 'div',
          properties: { class: 'twoslash-popup-jsdoc' },
          children: [
            {
              type: 'text',
              value: docs,
            },
          ],
        })
      }
    }

    return themedContent
  }

  return {
    nodeStaticInfo(info, node) {
      const themedContent = hightlightPopupContent(this.codeToHast, this.options, info)

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'twoslash-hover',
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: ['twoslash-popup-info', classExtra].filter(Boolean).join(' '),
            },
            children: themedContent,
          },
          node,
        ],
      }
    },

    nodeQuery(query, node) {
      if (!query.text)
        return {}

      const themedContent = hightlightPopupContent(this.codeToHast, this.options, query)

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'twoslash-hover twoslash-query-presisted',
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: ['twoslash-popup-info', classExtra].filter(Boolean).join(' '),
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
          node,
        ],
      }
    },

    nodeCompletions(query, node) {
      if (node.type !== 'text')
        throw new Error(`[shikiji-twoslash] nodeCompletions only works on text nodes, got ${node.type}`)

      const leftPart = query.completionsPrefix || ''
      const rightPart = node.value.slice(leftPart.length || 0)

      return {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [
          {
            type: 'text',
            value: leftPart,
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              class: ['twoslash-completions-list', classExtra].filter(Boolean).join(' '),
            },
            children: [{
              type: 'element',
              tagName: 'ul',
              properties: {},
              children: query.completions!
                .filter(i => i.name.startsWith(query.completionsPrefix || '____'))
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
                              value: query.completionsPrefix || '',
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
                              value: i.name.slice(query.completionsPrefix?.length || 0),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                })),
            }],
          },
          {
            type: 'text',
            value: rightPart,
          },
        ],
      }
    },

    nodeError(_, node) {
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'twoslash-error',
        },
        children: [node],
      }
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
              value: error.renderedMessage,
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
              ? [
                <Element>{
                  type: 'element',
                  tagName: 'span',
                  properties: { class: `twoslash-tag-icon tag-${tag.name}-icon` },
                  children: [
                    customTagIcons[tag.name],
                  ].filter(Boolean),
                },
                ]
              : [],
            {
              type: 'text',
              value: tag.annotation || '',
            },
          ],
        },
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
