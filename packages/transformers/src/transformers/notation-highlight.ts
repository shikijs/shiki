import type { ShikiTransformer } from 'shiki'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationHighlightOptions {
  /**
   * Class for highlighted lines
   */
  classActiveLine?: string
  /**
   * Class added to the root element when the code has highlighted lines
   */
  classActivePre?: string

  legacy?: boolean
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
    legacy,
  } = options

  return transformerNotationMap(
    {
      classMap: {
        highlight: classActiveLine,
        hl: classActiveLine,
      },
      legacy,
      classActivePre,
    },
    '@shikijs/transformers:notation-highlight',
  )
}
