import type { ShikiTransformer } from 'shiki'
import { transformerNotationMap } from './notation-map'

export interface TransformerNotationDiffOptions {
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

  legacy?: boolean
}

/**
 * Use `[!code ++]` and `[!code --]` to mark added and removed lines.
 */
export function transformerNotationDiff(
  options: TransformerNotationDiffOptions = {},
): ShikiTransformer {
  const {
    classLineAdd = 'diff add',
    classLineRemove = 'diff remove',
    classActivePre = 'has-diff',
    legacy,
  } = options

  return transformerNotationMap(
    {
      classMap: {
        '++': classLineAdd,
        '--': classLineRemove,
      },
      legacy,
      classActivePre,
    },
    '@shikijs/transformers:notation-diff',
  )
}
