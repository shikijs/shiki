import type { ShikiTransformer } from 'shiki'
import { highlightWordInLine } from '../shared/highlight-word'
import { createCommentNotationTransformer } from '../utils'

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

export function transformerNotationWordHighlight(
  options: TransformerNotationWordHighlightOptions = {},
): ShikiTransformer {
  const {
    classActiveWord = 'highlighted-word',
    classActivePre = undefined,
  } = options

  return createCommentNotationTransformer(
    '@shikijs/transformers:notation-highlight-word',
    // comment-start             | marker    | word           | range | comment-end
    /^\s*(?:\/\/|\/\*|<!--|#)\s+\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]\s*(?:\*\/|-->)?/,
    function ([_, word, range], _line, comment, lines, index) {
      const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length

      // escape backslashes
      word = word.replace(/\\(.)/g, '$1')

      lines
        // Don't include the comment itself
        .slice(index + 1, index + 1 + lineNum)
        .forEach(line => highlightWordInLine.call(this, line, comment, word, classActiveWord))

      if (classActivePre)
        this.addClassToHast(this.pre, classActivePre)
      return true
    },
    true, // remove empty lines
  )
}
