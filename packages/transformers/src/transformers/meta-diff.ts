import type { ShikiTransformer } from '@shikijs/types'
import { transformerMetaMap } from './meta-map'

export interface TransformerMetaDiffOptions {
  /**
   * Class for added lines
   */
  classLineAdd?: string
  /**
   * Class for removed lines
   */
  classLineRemove?: string
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string
}

export function transformerMetaDiff(
  options: TransformerMetaDiffOptions = {},
): ShikiTransformer {
  const {
    classLineAdd = 'diff add',
    classLineRemove = 'diff remove',
    classActivePre = 'has-diff',
  } = options

  return transformerMetaMap(
    {
      classMap: {
        add: classLineAdd,
        remove: classLineRemove,
      },
      classActivePre,
    },
    '@shikijs/transformers:meta-diff',
  )
}
