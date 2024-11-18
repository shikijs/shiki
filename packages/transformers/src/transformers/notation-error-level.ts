import type { ShikiTransformer } from 'shiki'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationErrorLevelOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string

  legacy?: boolean
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
    },
    classActivePre = 'has-highlighted',
    legacy,
  } = options

  return transformerNotationMap(
    {
      classMap,
      classActivePre,
      legacy,
    },
    '@shikijs/transformers:notation-error-level',
  )
}
