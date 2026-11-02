import type { ShikiTransformer, ShikiTransformerContext } from '@shikijs/core'
import type { Element } from 'hast'
import type { MatchAlgorithmOptions } from '../shared/notation-transformer'
import { highlightWordInLine } from '../shared/highlight-word'
import { createCommentNotationTransformer } from '../shared/notation-transformer'

export interface TransformerNotationDiffWordOptions extends MatchAlgorithmOptions {
  /**
   * Class for added words
   */
  classActiveWordAdd?: string
  /**
   * Class for removed words
   */
  classActiveWordRemove?: string
  /**
   * Class added to the root element when the current code has diff
   */
  classActivePre?: string
}

export function transformerNotationDiffWord(
  options: TransformerNotationDiffWordOptions = {},
): ShikiTransformer {
  const {
    classActiveWordAdd = 'diff add',
    classActiveWordRemove = 'diff remove',
    classActivePre = 'has-diff',
  } = options

  return createCommentNotationTransformer(
    '@shikijs/transformers:notation-diff-word',
    // Matches: [!code ++:word] or [!code --:word] or [!code ++:word:1]
    /\s*\[!code (\+\+|--):((?:\\.|[^:\]])+)(:\d+)?\]/,
    function (this: ShikiTransformerContext, [_, type, word, range]: string[], _line: Element, comment: Element, lines: Element[], index: number) {
      const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length

      // escape backslashes
      word = word.replace(/\\(.)/g, '$1')
      const className = type === '++' ? classActiveWordAdd : classActiveWordRemove

      for (let i = index; i < Math.min(index + lineNum, lines.length); i++) {
        highlightWordInLine.call(this, lines[i], comment, word, className)
      }

      if (classActivePre)
        this.addClassToHast(this.pre, classActivePre)

      return true
    },
    options.matchAlgorithm,
  )
}
