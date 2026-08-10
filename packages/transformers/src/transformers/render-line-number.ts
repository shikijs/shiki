import type { ShikiTransformer } from '@shikijs/types'
import type { Element, Text } from 'hast'

export interface TransformerRenderLineNumberOptions {
  /**
   * Class for line number
   *
   * @default 'line-number'
   */
  classLineNumber?: string
  /**
   * Start number
   *
   * @default 1
   */
  startNumber?: number
}

/**
 * Render line numbers for each line.
 */
export function transformerRenderLineNumber(
  options: TransformerRenderLineNumberOptions = {},
): ShikiTransformer {
  const {
    classLineNumber = 'line-number',
    startNumber = 1,
  } = options

  return {
    name: '@shikijs/transformers:render-line-number',
    code(code) {
      const lines = code.children.filter(i => i.type === 'element') as Element[]
      lines.forEach((line, idx) => {
        const number = startNumber + idx
        const lineNumber: Element = {
          type: 'element',
          tagName: 'span',
          properties: {
            className: [classLineNumber],
          },
          children: [
            {
              type: 'text',
              value: `${number}`,
            } as Text,
          ],
        }
        line.children.unshift(lineNumber)
      })
    },
  }
}
