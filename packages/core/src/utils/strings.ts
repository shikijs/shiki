import type { HighlighterGeneric, Position } from '@shikijs/types'

/**
 * Split a string into lines, each line preserves the line ending.
 */
export function splitLines(code: string, preserveEnding = false): [string, number][] {
  const parts = code.split(/(\r?\n)/g)
  let index = 0
  const lines: [string, number][] = []
  for (let i = 0; i < parts.length; i += 2) {
    const line = preserveEnding
      ? parts[i] + (parts[i + 1] || '')
      : parts[i]
    lines.push([line, index])
    index += parts[i].length
    index += parts[i + 1]?.length || 0
  }
  return lines
}

/**
 * Creates a converter between index and position in a code block.
 *
 * Overflow/underflow are unchecked.
 */
export function createPositionConverter(code: string): {
  lines: string[]
  indexToPos: (index: number) => Position
  posToIndex: (line: number, character: number) => number
} {
  const lines = splitLines(code, true).map(([line]) => line)

  function indexToPos(index: number): Position {
    if (index === code.length) {
      return {
        line: lines.length - 1,
        character: lines[lines.length - 1].length,
      }
    }

    let character = index
    let line = 0
    for (const lineText of lines) {
      if (character < lineText.length)
        break
      character -= lineText.length
      line++
    }
    return { line, character }
  }

  function posToIndex(line: number, character: number): number {
    let index = 0
    for (let i = 0; i < line; i++)
      index += lines[i].length

    index += character
    return index
  }

  return {
    lines,
    indexToPos,
    posToIndex,
  }
}

/**
 * Guess embedded languages from given code and highlighter.
 *
 * When highlighter is provided, only bundled languages will be included.
 */
export function guessEmbeddedLanguages(
  code: string,
  _lang: string | undefined,
  highlighter?: HighlighterGeneric<any, any>,
): string[] {
  const langs = new Set<string>()
  // For HTML code blocks like Vue SFC
  for (const match of code.matchAll(/lang=["']([\w-]+)["']/g)) {
    langs.add(match[1])
  }
  // For markdown code blocks
  for (const match of code.matchAll(/(?:```|~~~)([\w-]+)/g)) {
    langs.add(match[1])
  }
  // For latex
  for (const match of code.matchAll(/\\begin\{([\w-]+)\}/g)) {
    langs.add(match[1])
  }

  if (!highlighter)
    return Array.from(langs)

  // Only include known languages
  const bundle = highlighter.getBundledLanguages()
  return Array.from(langs)
    .filter(l => l && bundle[l])
}
