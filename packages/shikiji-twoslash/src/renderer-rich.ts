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
   */
  formatInfo?(info: string): string

  /**
   * Classes added to injected elements
   */
  classExtra?: string
}

/**
 * An alternative renderer that providers better prefixed class names,
 * with syntax highlight for the info text.
 */
export function rendererRich(options: RendererRichOptions = {}): TwoSlashRenderers {
  const {
    completionIcons = defaultCompletionIcons,
    customTagIcons = defaultCustomTagIcons,
    formatInfo = info => info,
    classExtra = '',
    jsdoc = true,
  } = options

  function hightlightPopupContent(
    codeToHast: ShikijiTransformerContextCommon['codeToHast'],
    options: ShikijiTransformerContextCommon['options'],
    info: { text?: string, docs?: string },
  ) {
    if (!info.text)
      return []

    const themedContent = ((codeToHast(formatInfo(info.text), {
      ...options,
      transformers: [],
      transforms: undefined,
    }).children[0] as Element).children[0] as Element).children

    if (jsdoc && info.docs) {
      themedContent.push({
        type: 'element',
        tagName: 'div',
        properties: { class: 'twoslash-popup-jsdoc' },
        children: [
          {
            type: 'text',
            value: info.docs,
          },
        ],
      })
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
