import type { ShikiTransformer } from '@shikijs/types'
import type { MatchAlgorithmOptions } from '../shared/notation-transformer'
import { createCommentNotationTransformer } from '../shared/notation-transformer'

export interface TransformerNotationErrorLevelOptions extends MatchAlgorithmOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string
  /**
   * Class added to the <code> element when the current code has diff
   */
  classActiveCode?: string
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Allow using `[!code error]` `[!code warning]` notation in code to mark highlighted lines.
 */
export function transformerNotationErrorLevel(
  options: TransformerNotationErrorLevelOptions = {},
): ShikiTransformer {
  const {
    classMap = {
      error: ['highlighted', 'error'],
      warning: ['highlighted', 'warning'],
      info: ['highlighted', 'info'],
    },
    classActivePre = 'has-highlighted',
    classActiveCode,
  } = options

  return createCommentNotationTransformer(
    '@shikijs/transformers:notation-error-level',
    new RegExp(`\\s*\\[!code (${Object.keys(classMap).map(escapeRegExp).join('|')})(:.*)?\\]`, 'gi'),
    function ([_, match, rawRange = ''], _line, _comment, lines, index) {
      const range = rawRange ? rawRange.slice(1) : ''
      if (/^\d+$/.test(range)) {
        const lineNum = Number.parseInt(range, 10)
        for (let i = index; i < Math.min(index + lineNum, lines.length); i++) {
          this.addClassToHast(lines[i], classMap[match])
        }
      }
      else {
        this.addClassToHast(lines[index], classMap[match])
        if (range) {
          const properties = lines[index].properties || {}
          properties[`data-${match}`] = range
          lines[index].properties = properties
        }
      }

      if (classActivePre)
        this.addClassToHast(this.pre, classActivePre)
      if (classActiveCode)
        this.addClassToHast(this.code, classActiveCode)
      return true
    },
    options.matchAlgorithm,
  )
}
