import type { ShikiTransformer } from '@shikijs/types'

export interface TransformerMetaDiffOptions {
  /**
   * Class for added lines
   *
   * @default 'diff add'
   */
  classLineAdd?: string
  /**
   * Class for removed lines
   *
   * @default 'diff remove'
   */
  classLineRemove?: string
}

const symbol = Symbol('diff-lines')

/**
 * Allow using `{1+,3-5-}` in the code snippet meta to mark added/removed lines.
 */
export function transformerMetaDiff(
  options: TransformerMetaDiffOptions = {},
): ShikiTransformer {
  const {
    classLineAdd = 'diff add',
    classLineRemove = 'diff remove',
  } = options

  return {
    name: '@shikijs/transformers:meta-diff',
    line(node, lineNumber) {
      if (!this.options.meta?.__raw)
        return

      const meta = this.meta as { [symbol]: Map<number, string> | null }
      meta[symbol] ??= parseMetaDiffString(this.options.meta.__raw)

      const diffs = meta[symbol]
      if (!diffs)
        return

      const type = diffs.get(lineNumber)
      if (type === '+')
        this.addClassToHast(node, classLineAdd)
      else if (type === '-')
        this.addClassToHast(node, classLineRemove)
    },
  }
}

export function parseMetaDiffString(meta: string): Map<number, string> | null {
  if (!meta)
    return null

  const match = meta.match(/\{([^}]+)\}/)
  if (!match)
    return null

  const map = new Map<number, string>()

  // Split by comma
  const parts = match[1].split(',')
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed)
      continue

    // Check for + or - suffix
    const type = trimmed.endsWith('+')
      ? '+'
      : trimmed.endsWith('-')
        ? '-'
        : null
    if (!type)
      continue

    const content = trimmed.slice(0, -1)

    // Parse range or number
    const range = content.split('-').map(n => Number.parseInt(n, 10))
    if (range.some(Number.isNaN))
      continue

    const lines = range.length === 1
      ? [range[0]]
      : Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i)

    for (const line of lines) {
      map.set(line, type)
    }
  }

  if (map.size === 0)
    return null

  return map
}
