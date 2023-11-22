import type { ShikijiTransformer } from 'shikiji'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationErrorLevelOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string
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
    classActivePre = 'has-highlighted',
  } = options

  return transformerNotationMap(
    {
      classMap,
      classActivePre,
    },
    'shikiji-transformers:notation-error-level',
  )
}
