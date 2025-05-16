import type { ShikiTransformer } from '@shikijs/types'
import { transformerMetaMap } from './meta-map'

export interface TransformerMetaErrorLevelOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string
}

export function transformerMetaErrorLevel(
  options: TransformerMetaErrorLevelOptions = {},
): ShikiTransformer {
  const {
    classMap = {
      error: ['highlighted', 'error'],
      warning: ['highlighted', 'warning'],
    },
    classActivePre = 'has-highlighted',
  } = options

  return transformerMetaMap(
    {
      classMap,
      classActivePre,
    },
    '@shikijs/transformers:meta-error-level',
  )
}
