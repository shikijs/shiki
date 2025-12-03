import type { ShikiTransformer } from '@shikijs/types'

export interface TransformerCompactLineOption {
  /**
   * 1-based line number.
   */
  line: number
  classes?: string[]
}

/**
 * Transformer for `shiki`'s legacy `lineOptions`
 */
export function transformerCompactLineOptions(
  lineOptions: TransformerCompactLineOption[] = [],
): ShikiTransformer {
  const lineOptionsMap = new Map<number, string[]>()

  for (const option of lineOptions) {
    if (!lineOptionsMap.has(option.line) && option.classes) {
      lineOptionsMap.set(option.line, option.classes)
    }
  }

  return {
    name: '@shikijs/transformers:compact-line-options',
    line(node, line) {
      const classes = lineOptionsMap.get(line)
      if (classes)
        this.addClassToHast(node, classes)
      return node
    },
  }
}
