import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'
import { createCommentNotationTransformer } from '../utils'

export interface TransformerNotationHighlightOptions {
  /**
   * Class for highlighted lines
   */
  classHighlight?: string
  /**
   * Class added to the root element when the code has highlighted lines
   */
  classRootActive?: string
}

/**
 * Allow using `[!code highlight]` notation in code to mark highlighted lines.
 */
export function transformerNotationHighlight(
  options: TransformerNotationHighlightOptions = {},
): ShikijiTransformer {
  const {
    classHighlight = 'highlighted',
    classRootActive = 'has-highlighted',
  } = options

  return createCommentNotationTransformer(
    'shikiji-transformers:notation-highlight',
    /\[!code (?:hl|highlight)(:\d+)?\]/,
    function ([_, range = ':1'], _line, _comment, lines, index) {
      const lineNum = Number.parseInt(range.slice(1), 10)
      lines
        .slice(index, index + lineNum)
        .forEach((line) => {
          addClassToHast(line, classHighlight)
        })
      if (classRootActive)
        addClassToHast(this.pre, classRootActive)
      return true
    },
  )
}
