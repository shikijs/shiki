import type { ShikiTransformer } from '@shikijs/types'
import type { MatchAlgorithmOptions } from '../shared/notation-transformer'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationHighlightOptions extends MatchAlgorithmOptions {
  /**
   * Class for highlighted lines
   */
  classActiveLine?: string
  /**
   * Class added to the root element when the code has highlighted lines
   */
  classActivePre?: string
}

/**
 * Allow using `[!code highlight]` notation in code to mark highlighted lines.
 */
export function transformerNotationHighlight(
  options: TransformerNotationHighlightOptions = {},
): ShikiTransformer {
  const {
    classActiveLine = 'highlighted',
    classActivePre = 'has-highlighted',
  } = options

  return transformerNotationMap(
    {
      classMap: {
        highlight: classActiveLine,
        hl: classActiveLine,
      },
      classActivePre,
      matchAlgorithm: options.matchAlgorithm,
    },
    '@shikijs/transformers:notation-highlight',
  )
}
