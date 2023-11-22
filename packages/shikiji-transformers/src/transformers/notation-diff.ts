import type { ShikijiTransformer } from 'shikiji'
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
}

/**
 * Use `[!code ++]` and `[!code --]` to mark added and removed lines.
 */
export function transformerNotationDiff(
  options: TransformerNotationDiffOptions = {},
): ShikijiTransformer {
  const {
    classLineAdd = 'diff add',
    classLineRemove = 'diff remove',
    classActivePre = 'has-diff',
  } = options

  return transformerNotationMap(
    {
      classMap: {
        '++': classLineAdd,
        '--': classLineRemove,
      },
      classActivePre,
    },
    'shikiji-transformers:notation-diff',
  )
}
