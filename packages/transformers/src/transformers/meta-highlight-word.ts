import type { ShikiTransformer } from '@shikijs/types'

export function parseMetaHighlightWords(meta: string): string[] {
  if (!meta)
    return []

  // https://regex101.com/r/BHS5fd/1
  const match = Array.from(meta.matchAll(/\/((?:\\.|[^/])+)\//g))

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
): ShikiTransformer {
  const {
    className = 'highlighted-word',
  } = options

  return {
    name: '@shikijs/transformers:meta-word-highlight',
    preprocess(code, options) {
      if (!this.options.meta?.__raw)
        return

      const words = parseMetaHighlightWords(this.options.meta.__raw)
      options.decorations ||= []
      for (const word of words) {
        const indexes = findAllSubstringIndexes(code, word)
        for (const index of indexes) {
          options.decorations.push({
            start: index,
            end: index + word.length,
            properties: {
              class: className,
            },
          })
        }
      }
    },
  }
}

export function findAllSubstringIndexes(str: string, substr: string): number[] {
  const indexes = []
  const re = new RegExp(substr, 'g')
  let match = re.exec(str)
  while (match !== null) {
    indexes.push(match.index)
    match = re.exec(str)
  }
  return indexes
}
