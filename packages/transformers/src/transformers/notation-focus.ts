import type { ShikiTransformer } from 'shiki'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationFocusOptions {
  /**
   * Class for focused lines
   */
  classActiveLine?: string
  /**
   * Class added to the root element when the code has focused lines
   */
  classActivePre?: string

  legacy?: boolean
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
    legacy,
  } = options

  return transformerNotationMap(
    {
      classMap: {
        focus: classActiveLine,
      },
      classActivePre,
      legacy,
    },
    '@shikijs/transformers:notation-focus',
  )
}
