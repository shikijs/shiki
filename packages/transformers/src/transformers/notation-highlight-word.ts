import type { ShikiTransformer } from 'shiki'
import { createCommentNotationTransformer } from '../utils'
import { highlightWordInLine } from '../shared/highlight-word'

export interface TransformerNotationWordHighlightOptions {
  /**
   * Class for highlighted words
   */
  classActiveWord?: string
  /**
   * Class added to the root element when the code has highlighted words
   */
  classActivePre?: string
}

const regex = /\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]/

export function transformerNotationWordHighlight(
  options: TransformerNotationWordHighlightOptions = {},
): ShikiTransformer {
  const {
    classActiveWord = 'highlighted-word',
    classActivePre,
  } = options

  return createCommentNotationTransformer(
    '@shikijs/transformers:notation-highlight-word',
    function (text, _line, comment, lines, index) {
      const result = regex.exec(text)
      if (!result)
        return false

      let [_, word, range] = result
      const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length

      // escape backslashes
      word = word.replace(/\\(.)/g, '$1')

      lines
        // Don't include the comment itself
        .slice(index, index + lineNum)
        .forEach(line => highlightWordInLine.call(this, line, comment, word, classActiveWord))

      if (classActivePre)
        this.addClassToHast(this.pre, classActivePre)
      return true
    },
    true,
  )
}
