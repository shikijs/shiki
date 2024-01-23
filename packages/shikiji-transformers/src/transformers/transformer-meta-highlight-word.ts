import type { ShikijiTransformer } from 'shikiji'
import { highlightWordInLine } from '../shared/highlight-word'

export function parseMetaHighlightWords(meta: string): string[] {
  if (!meta)
    return []

  // https://regex101.com/r/BHS5fd/1
  const match = Array.from(meta.matchAll(/\/((?:\\.|[^\/])+?)\//ig))

  return match
    // Escape backslashes
    .map(v => v[1].replace(/\\(.)/g, '$1'))
}

export interface TransformerMetaWordHighlightOptions {
  /**
   * Class for highlighted words
   *
   * @default 'highlighted-word'
   */
  className?: string
}

/**
 * Allow using `/word/` in the code snippet meta to mark highlighted words.
 */
export function transformerMetaWordHighlight(
  options: TransformerMetaWordHighlightOptions = {},
): ShikijiTransformer {
  const {
    className = 'highlighted-word',
  } = options

  return {
    name: 'shikiji-transformers:meta-word-highlight',
    line(node) {
      if (!this.options.meta?.__raw)
        return

      const words = parseMetaHighlightWords(this.options.meta.__raw)

      for (const word of words)
        highlightWordInLine(node, null, word, className)

      return node
    },
  }
}
