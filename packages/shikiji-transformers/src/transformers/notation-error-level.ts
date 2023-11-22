import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'
import { createCommentNotationTransformer } from '../utils'

export interface TransformerNotationErrorLevelOptions {
  classMap?: Record<string, string | string[]>
}

/**
 * Allow using `[!code error]` `[!code warning]` notation in code to mark highlighted lines.
 */
export function transformerNotationErrorLevel(
  options: TransformerNotationErrorLevelOptions = {},
): ShikijiTransformer {
  const {
    classMap = {
      error: ['highlighted', 'error'],
      warning: ['highlighted', 'warning'],
    },
  } = options

  return createCommentNotationTransformer(
    'shikiji-transformers:notation-error-level',
    new RegExp(`\\[!code (${Object.keys(classMap).join('|')})\\]`),
    ([_, match], line) => {
      addClassToHast(line, classMap[match])
      return true
    },
  )
}
