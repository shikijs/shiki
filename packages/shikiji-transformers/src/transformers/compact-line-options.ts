import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'

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
): ShikijiTransformer {
  return {
    name: 'shikiji-transformers:compact-line-options',
    line(node, line) {
      const lineOption = lineOptions.find(o => o.line === line)
      if (lineOption?.classes)
        addClassToHast(node, lineOption.classes)
      return node
    },
  }
}
