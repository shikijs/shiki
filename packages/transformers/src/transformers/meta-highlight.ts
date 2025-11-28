import type { ShikiTransformer } from '@shikijs/types'

export function parseMetaHighlightString(meta: string): number[] | null {
  if (!meta)
    return null

  const match = meta.match(/\{([\d,-]+)\}/)
  if (!match)
    return null

  const lines = match[1]
    .split(',')
    .flatMap((v) => {
      const range = v.split('-').map(n => Number.parseInt(n, 10))
      return range.length === 1
        ? [range[0]]
        : Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i)
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
  /**
   * Interpret line numbers as 0-indexed
   *
   * @default false
   */
  zeroIndexed?: boolean
}

const symbol = Symbol('highlighted-lines')

/**
 * Allow using `{1,3-5}` in the code snippet meta to mark highlighted lines.
 */
export function transformerMetaHighlight(
  options: TransformerMetaHighlightOptions = {},
): ShikiTransformer {
  const { className = 'highlighted', zeroIndexed = false } = options

  return {
    name: '@shikijs/transformers:meta-highlight',
    line(node, lineNumber) {
      if (!this.options.meta?.__raw)
        return

      const meta = this.meta as { [symbol]: number[] | null }
      meta[symbol] ??= parseMetaHighlightString(this.options.meta.__raw)

      const highlightedLines: number[] = meta[symbol] ?? []
      const effectiveLine = zeroIndexed ? lineNumber - 1 : lineNumber

      if (highlightedLines.includes(effectiveLine))
        this.addClassToHast(node, className)

      return node
    },
  }
}
