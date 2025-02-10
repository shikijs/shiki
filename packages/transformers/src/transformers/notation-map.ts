import type { ShikiTransformer } from '@shikijs/types'
import type { MatchAlgorithmOptions } from '../shared/notation-transformer'
import { createCommentNotationTransformer } from '../shared/notation-transformer'

export interface TransformerNotationMapOptions extends MatchAlgorithmOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function transformerNotationMap(
  options: TransformerNotationMapOptions = {},
  name = '@shikijs/transformers:notation-map',
): ShikiTransformer {
  const {
    classMap = {},
    classActivePre = undefined,
  } = options

  return createCommentNotationTransformer(
    name,
    new RegExp(`\\s*\\[!code (${Object.keys(classMap).map(escapeRegExp).join('|')})(:(\\d+)(-\\d+)?)?\\]`),
    function ([_, match, range = ':1'], _line, _comment, lines, index) {
      let [startOffset, endOffset] = [1, 1]

      if (range) {
        const rangeParts = range.slice(1).split('-')
        if (rangeParts.length === 2) {
          [startOffset, endOffset] = rangeParts.map(part => Number.parseInt(part, 10))
          if (startOffset === 0)
            return false
        }
        else {
          endOffset = Number.parseInt(rangeParts[0], 10)
        }
      }

      for (let i = index + startOffset - 1; i < Math.min(index + endOffset, lines.length); i++) {
        this.addClassToHast(lines[i], classMap[match])
      }

      if (classActivePre) {
        this.addClassToHast(this.pre, classActivePre)
      }
      return true
    },
    options.matchAlgorithm,
  )
}
