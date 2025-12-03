import type { ShikiTransformer } from '@shikijs/types'

export interface TransformerRenderLineNumberOptions {
  /**
   * Class for line number
   *
   * @default 'line-number'
   */
  classLineNumber?: string
  /**
   * Start line number
   *
   * @default 1
   */
  start?: number
}

/**
 * Render line numbers.
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
      const lineNumber = line + start - 1
      const lineNumberNode = {
        type: 'element',
        tagName: 'span',
        properties: {
          class: classLineNumber,
        },
        children: [{ type: 'text', value: String(lineNumber) }],
      }

      node.children.unshift(lineNumberNode as any)
      return node
    },
  }
}
