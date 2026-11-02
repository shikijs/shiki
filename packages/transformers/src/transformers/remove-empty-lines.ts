import type { ShikiTransformer } from '@shikijs/types'

export interface TransformerRemoveEmptyLinesOptions {
  /**
   * Remove lines that contain only whitespace in addition to truly empty lines.
   * @default true
   */
  removeWhitespaceOnlyLines?: boolean
}

/**
 * Remove empty lines from the highlighted code output.
 *
 * Useful when you want to strip blank lines from code snippets
 * before rendering (e.g. removing leading/trailing blank lines
 * that come from template literals).
 *
 * @see {@link https://github.com/shikijs/shiki/issues/1206}
 */
export function transformerRemoveEmptyLines(
  options: TransformerRemoveEmptyLinesOptions = {},
): ShikiTransformer {
  const { removeWhitespaceOnlyLines = true } = options

  return {
    name: '@shikijs/transformers:remove-empty-lines',
    tokens(lines) {
      return lines.filter((line) => {
        if (line.length === 0)
          return false
        if (removeWhitespaceOnlyLines)
          return line.some(token => token.content.trim().length > 0)
        return true
      })
    },
  }
}
