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
      const parsedMeta = parseMetaString(this.options.meta.__raw, Object.keys(classMap)) ?? {}

      if (classActivePre && Object.keys(parsedMeta).length > 0) {
        this.addClassToHast(this.pre, classActivePre)
      }

      const lines = code.children.filter(i => i.type === 'element')
      Object.entries(parsedMeta).forEach(([key, lineNumbers]) => {
        meta[Symbol(key)] ??= parsedMeta[key]
        lineNumbers.forEach((lineNumber) => {
          if (lines[lineNumber - 1]) {
            this.addClassToHast(lines[lineNumber - 1], classMap[key])
          }
        })
      })
    },
  }
}
