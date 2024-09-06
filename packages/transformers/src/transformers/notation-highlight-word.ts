import type { ShikiTransformer } from 'shiki'
import { highlightWordInLine } from '../shared/highlight-word'
import { createCommentNotationTransformerExperimental } from '../utils'

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

const regex = /\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]/g

export function transformerNotationWordHighlight(
  options: TransformerNotationWordHighlightOptions = {},
): ShikiTransformer {
  const {
    classActiveWord = 'highlighted-word',
    classActivePre,
  } = options

  return createCommentNotationTransformerExperimental(
    '@shikijs/transformers:notation-highlight-word',
    function (text, _line, comment, lines, index) {
      return text.replace(regex, (_, word, range) => {
        const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length

        // escape backslashes
        word = word.replace(/\\(.)/g, '$1')

        lines
          .slice(index, index + lineNum)
          .forEach(line => highlightWordInLine.call(this, line, comment, word, classActiveWord))

        if (classActivePre)
          this.addClassToHast(this.pre, classActivePre)

        return ''
      })
    },
  )
}
