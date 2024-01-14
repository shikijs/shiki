import { type ShikijiTransformer, addClassToHast } from 'shikiji'

export function parseMetaHighlightString(meta: string) {
  if (!meta)
    return null
  const match = meta.match(/{([\d,-]+)}/)
  if (!match)
    return null
  const lines = match[1].split(',')
    .flatMap((v) => {
      const num = v.split('-').map(v => Number.parseInt(v, 10))
      if (num.length === 1)
        return [num[0]]
      else
        return Array.from({ length: num[1] - num[0] + 1 }, (_, i) => i + num[0])
    })
  return lines
}

export interface TransformerMetaHighlightOptions {
  /**
   * Class for highlighted lines
   *
   * @default 'highlighted'
   */
  className?: string
}

const symbol = Symbol('highlighted-lines')

/**
 * Allow using `{1,3-5}` in the code snippet meta to mark highlighted lines.
 */
export function transformerMetaHighlight(
  options: TransformerMetaHighlightOptions = {},
): ShikijiTransformer {
  const {
    className = 'highlighted',
  } = options

  return {
    name: 'shikiji-transformers:meta-highlight',
    line(node, line) {
      if (!this.options.meta?.__raw)
        return
      ;(this.meta as any)[symbol] ||= parseMetaHighlightString(this.options.meta.__raw)
      const lines: number[] = (this.meta as any)[symbol] || []
      if (lines.includes(line))
        addClassToHast(node, className)
      return node
    },
  }
}
