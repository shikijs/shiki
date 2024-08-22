import type { ShikiTransformer } from 'shiki'
import { createCommentNotationTransformer } from '../utils'

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

  const regex = new RegExp(`\\[!code (${Object.keys(classMap).map(escapeRegExp).join('|')})(:\\d+)?\\]`)

  return createCommentNotationTransformer(
    name,
    function (text, _line, _comment, lines, index) {
      const result = regex.exec(text)
      if (!result)
        return false

      const [_, match, range = ':1'] = result
      const lineNum = Number.parseInt(range.slice(1), 10)

      lines
        .slice(index, index + lineNum)
        .forEach((line) => {
          this.addClassToHast(line, classMap[match])
        })
      if (classActivePre)
        this.addClassToHast(this.pre, classActivePre)
      return true
    },
  )
}
