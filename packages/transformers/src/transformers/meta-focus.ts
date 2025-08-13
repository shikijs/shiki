import type { ShikiTransformer } from '@shikijs/types'
import { transformerMetaMap } from './meta-map'

export interface TransformerMetaFocusOptions {
  /**
   * Class for focused lines
   */
  classActiveLine?: string
  /**
   * Class added to the root element when the code has focused lines
   */
  classActivePre?: string
}

export function transformerMetaFocus(
  options: TransformerMetaFocusOptions = {},
): ShikiTransformer {
  const {
    classActiveLine = 'focused',
    classActivePre = 'has-focused',
  } = options

  return transformerMetaMap(
    {
      classMap: {
        focus: classActiveLine,
      },
      classActivePre,
    },
    '@shikijs/transformers:meta-focus',
  )
}
