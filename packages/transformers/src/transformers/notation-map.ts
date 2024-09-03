import type { ShikiTransformer } from 'shiki'
import { createCommentNotationTransformerExperimental } from '../utils'

export interface TransformerNotationMapOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string
}

function escapeRegExp(str: string) {
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

  const regex = new RegExp(`\\[!code (${Object.keys(classMap).map(escapeRegExp).join('|')})(:\\d+)?\\]`, 'g')

  return createCommentNotationTransformerExperimental(
    name,
    function (text, _line, _comment, lines, index) {
      return text.replace(regex, (_, group, range = ':1') => {
        const lineNum = Number.parseInt(range.slice(1), 10)

        lines
          .slice(index, index + lineNum)
          .forEach((line) => {
            this.addClassToHast(line, classMap[group])
          })

        if (classActivePre)
          this.addClassToHast(this.pre, classActivePre)

        return ''
      })
    },
  )
}
