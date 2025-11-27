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
      const opts = options as any
      if (opts.includeExplanation !== true)
        opts.includeExplanation = true
    },
    tokens(tokens) {
      const result = []
      for (const line of tokens) {
        const hasComment = line.some(token =>
          token.explanation?.some(exp => exp.scopes.some(s => s.scopeName.startsWith('comment'))),
        )

        const filteredLine = line.filter((token) => {
          const isComment = token.explanation?.some(exp =>
            exp.scopes.some(s => s.scopeName.startsWith('comment')),
          )
          return !isComment
        })

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
