import type { ShikiTransformer } from 'shiki'

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
  return {
    name: '@shikijs/transformers:compact-line-options',
    line(node, line) {
      const lineOption = lineOptions.find(o => o.line === line)
      if (lineOption?.classes)
        this.addClassToHast(node, lineOption.classes)
      return node
    },
  }
}
