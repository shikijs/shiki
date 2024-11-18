import type { ShikiTransformer } from 'shiki'
import { highlightWordInLine } from '../shared/highlight-word'
import { createCommentNotationTransformer } from '../shared/notation-transformer'

export interface TransformerNotationWordHighlightOptions {
  /**
   * Class for highlighted words
   */
  classActiveWord?: string
  /**
   * Class added to the root element when the code has highlighted words
   */
  classActivePre?: string

  legacy?: boolean
}

export function transformerNotationWordHighlight(
  options: TransformerNotationWordHighlightOptions = {},
): ShikiTransformer {
  const {
    classActiveWord = 'highlighted-word',
    classActivePre = undefined,
    legacy,
  } = options

  return createCommentNotationTransformer(
    '@shikijs/transformers:notation-highlight-word',
    /\s*\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]/,
    function ([_, word, range], _line, comment, lines, index) {
      const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length

      // escape backslashes
      word = word.replace(/\\(.)/g, '$1')
      for (let i = index; i < Math.min(index + lineNum, lines.length); i++) {
        highlightWordInLine.call(this, lines[i], comment, word, classActiveWord)
      }

      if (classActivePre)
        this.addClassToHast(this.pre, classActivePre)
      return true
    },
    legacy,
  )
}
