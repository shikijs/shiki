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
  // Pre-compute line options into a Map for O(1) lookup
  const lineOptionsMap = new Map<number, TransformerCompactLineOption>()
  for (const option of lineOptions) {
    lineOptionsMap.set(option.line, option)
  }

  return {
    name: '@shikijs/transformers:compact-line-options',
    line(node, line) {
      const lineOption = lineOptionsMap.get(line)
      if (lineOption?.classes)
        this.addClassToHast(node, lineOption.classes)
      return node
    },
  }
}
