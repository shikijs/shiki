import type { ShikiTransformer } from '@shikijs/types'
import type { MatchAlgorithmOptions } from '../shared/notation-transformer'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationErrorLevelOptions extends MatchAlgorithmOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has error/warning annotations
   */
  classActivePre?: string
  /**
   * Class added to the <code> element when the current code has error/warning annotations
   */
  classActiveCode?: string
}

/**
 * Allow using `[!code error]` `[!code warning]` notation in code to mark highlighted lines.
 */
export function transformerNotationErrorLevel(
  options: TransformerNotationErrorLevelOptions = {},
): ShikiTransformer {
  const {
    classMap = {
      error: ['highlighted', 'error'],
      warning: ['highlighted', 'warning'],
      info: ['highlighted', 'info'],
    },
    classActivePre = 'has-highlighted',
    classActiveCode,
  } = options

  return transformerNotationMap(
    {
      classMap,
      classActivePre,
      classActiveCode,
      matchAlgorithm: options.matchAlgorithm,
    },
    '@shikijs/transformers:notation-error-level',
  )
}
