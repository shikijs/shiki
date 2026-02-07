import type { ShikiTransformer } from '@shikijs/types'

export interface TransformerRenderLineNumberOptions {
  /**
   * Class for line number
   * @default 'line-number'
   */
  classLineNumber?: string
  /**
   * Start number
   * @default 1
   */
  start?: number
}

/**
 * Render line number as separate tokens.
 */
export function transformerRenderLineNumber(
  options: TransformerRenderLineNumberOptions = {},
): ShikiTransformer {
  const {
    classLineNumber = 'line-number',
    start = 1,
  } = options

  return {
    name: '@shikijs/transformers:render-line-number',
    line(node, line) {
      if (node.tagName === 'span') {
        const num = start + line - 1
        node.children.unshift({
          type: 'element',
          tagName: 'span',
          properties: {
            class: classLineNumber,
          },
          children: [{ type: 'text', value: String(num) }],
        })
      }
    },
  }
}
