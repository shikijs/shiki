import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'
import { createCommentNotationTransformer } from '../utils'

export interface TransformerNotationDiffOptions {
  /**
   * Class for added lines
   */
  classAdded?: string
  /**
   * Class for removed lines
   */
  classRemoved?: string
  /**
   * Class added to the root element when the current code has diff
   */
  classRootActive?: string
}

/**
 * Use `[!code ++]` and `[!code --]` to mark added and removed lines.
 */
export function transformerNotationDiff(
  options: TransformerNotationDiffOptions = {},
): ShikijiTransformer {
  const {
    classAdded = 'diff add',
    classRemoved = 'diff remove',
    classRootActive = 'has-diff',
  } = options

  return createCommentNotationTransformer(
    'shikiji-transformers:notation-diff',
    /\[!code (\-\-|\+\+)(:\d+)?\]/,
    function ([_, match, range = ':1'], _line, _comment, lines, index) {
      const className = match === '--'
        ? classRemoved
        : classAdded
      const lineNum = Number.parseInt(range.slice(1), 10)
      lines
        .slice(index, index + lineNum)
        .forEach((line) => {
          addClassToHast(line, className)
        })
      if (classRootActive)
        addClassToHast(this.pre, classRootActive)
      return true
    },
  )
}
