import type { ShikiTransformer } from '@shikijs/types'

export interface TransformerRemoveCommentsOptions {
  /**
   * Remove lines that become empty after removing comments.
   * @default true
   */
  removeEmptyLines?: boolean
}

/**
 * Remove comments from the code.
 */
export function transformerRemoveComments(
  options: TransformerRemoveCommentsOptions = {},
): ShikiTransformer {
  const { removeEmptyLines = true } = options

  return {
    name: '@shikijs/transformers:remove-comments',
    preprocess(_code, options) {
      if (options.includeExplanation !== true && options.includeExplanation !== 'scopeName')
        throw new Error('`transformerRemoveComments` requires `includeExplanation` to be set to `true` or `\'scopeName\'`')
    },
    tokens(tokens) {
      const result = []
      for (const line of tokens) {
        const filteredLine = []
        let hasComment = false
        for (const token of line) {
          const isComment = token.explanation?.some(exp =>
            exp.scopes.some(s => s.scopeName.startsWith('comment')),
          )
          if (isComment) {
            hasComment = true
          }
          else {
            filteredLine.push(token)
          }
        }

        if (removeEmptyLines && hasComment) {
          const isAllWhitespace = filteredLine.every(token => !token.content.trim())
          if (isAllWhitespace)
            continue
        }

        result.push(filteredLine)
      }
      return result
    },
  }
}
