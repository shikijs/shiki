import { type ShikijiTransformer, addClassToHast } from 'shikiji'
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

export function transformerNotationWordHighlight(
  options: TransformerNotationWordHighlightOptions = {},
): ShikijiTransformer {
  const {
    classActiveWord = 'highlighted-word',
    classActivePre = undefined,
  } = options

  return createCommentNotationTransformer(
    'shikiji-transformers:notation-highlight-word',
    /^\s*(?:\/\/|\/\*|<!--|#)\s+\[!code word:(\w+)(:\d+)?\]\s*(?:\*\/|-->)?/,
    function ([_, word, range], _line, comment, lines, index) {
      const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length

      lines
        // Don't include the comment itself
        .slice(index + 1, index + 1 + lineNum)
        .forEach(line => highlightWordInLine(line, comment, word, classActiveWord))

      if (classActivePre)
        addClassToHast(this.pre, classActivePre)
      return true
    },
    true, // remove empty lines
  )
}
