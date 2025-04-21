import type { ShikiTransformer } from 'shiki'
import { parseMetaString } from '../shared/parse-meta'

export interface TransformerMetaMapOptions {
  classMap?: Record<string, string | string[]>
  /**
   * Class added to the <pre> element when the current code has diff
   */
  classActivePre?: string
}

export function transformerMetaMap(
  options: TransformerMetaMapOptions = {},
  name = '@shikijs/transformers:meta-map',
): ShikiTransformer {
  const {
    classMap = {},
    classActivePre = undefined,
  } = options

  return {
    name,
    code(code) {
      if (!this.options.meta?.__raw) {
        return code
      }
      const meta = this.meta as {
        [key: symbol]: number[] | null
      }
      const parsedMeta: Record<string, number[]> = parseMetaString(this.options.meta.__raw, Object.keys(classMap)) ?? {}
      Object.keys(parsedMeta).forEach((key) => {
        meta[Symbol(key)] ??= parsedMeta[key]
      })

      if (classActivePre && Object.keys(parsedMeta).length > 0) {
        this.addClassToHast(this.pre, classActivePre)
      }

      const lines = code.children.filter(i => i.type === 'element')
      Object.entries(parsedMeta).forEach(([key, lineNumbers]) => {
        lineNumbers.forEach((lineNumber) => {
          const lineIndex = lineNumber - 1
          if (lines[lineIndex]) {
            this.addClassToHast(lines[lineIndex], classMap[key])
          }
        })
      })
    },
  }
}
