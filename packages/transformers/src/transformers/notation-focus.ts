import type { ShikiTransformer } from '@shikijs/types'
import type { MatchAlgorithmOptions } from '../shared/notation-transformer'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationFocusOptions extends MatchAlgorithmOptions {
  /**
   * Class for focused lines
   */
  classActiveLine?: string
  /**
   * Class added to the root element when the code has focused lines
   */
  classActivePre?: string
}

/**
 * Allow using `[!code focus]` notation in code to mark focused lines.
 */
export function transformerNotationFocus(
  options: TransformerNotationFocusOptions = {},
): ShikiTransformer {
  const {
    classActiveLine = 'focused',
    classActivePre = 'has-focused',
  } = options

  return transformerNotationMap(
    {
      classMap: {
        focus: classActiveLine,
      },
      classActivePre,
      matchAlgorithm: options.matchAlgorithm,
    },
    '@shikijs/transformers:notation-focus',
  )
}
