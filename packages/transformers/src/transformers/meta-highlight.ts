import type { ShikiTransformer } from '@shikijs/types'
import { transformerMetaMap } from './meta-map'

export interface TransformerMetaHighlightOptions {
  /**
   * Class for highlighted lines
   */
  classActiveLine?: string
  /**
   * Class added to the root element when the code has highlighted lines
   */
  classActivePre?: string
}

export function transformerMetaHighlight(
  options: TransformerMetaHighlightOptions = {},
): ShikiTransformer {
  const {
    classActiveLine = 'highlighted',
    classActivePre = 'has-highlighted',
  } = options

  return transformerMetaMap(
    {
      classMap: {
        highlight: classActiveLine,
        hl: classActiveLine,
      },
      classActivePre,
    },
    '@shikijs/transformers:meta-highlight',
  )
}
