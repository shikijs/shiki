import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'
import { createCommentNotationTransformer } from '../utils'

export interface TransformerNotationFocusOptions {
  /**
   * Class for focused lines
   */
  classFocused?: string
  /**
   * Class added to the root element when the code has focused lines
   */
  classRootActive?: string
}

/**
 * Allow using `[!code focus]` notation in code to mark focused lines.
 */
export function transformerNotationFocus(
  options: TransformerNotationFocusOptions = {},
): ShikijiTransformer {
  const {
    classFocused = 'focused',
    classRootActive = 'has-focused',
  } = options

  return createCommentNotationTransformer(
    'shikiji-transformers:notation-focus',
    /\[!code focus\]/,
    function (_, line) {
      addClassToHast(line, classFocused)
      if (classRootActive)
        addClassToHast(this.pre, classRootActive)
      return true
    },
  )
}
