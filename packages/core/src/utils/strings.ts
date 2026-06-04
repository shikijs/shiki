import type { HighlighterGeneric, Position } from '@shikijs/types'
import { splitLines } from '@shikijs/primitive'

const RE_LANG_ATTR = /:?lang=["']([^"']+)["']/g
const RE_CODE_FENCE = /(?:```|~~~)([\w-]+)/g
const RE_LATEX_BEGIN = /\\begin\{([\w-]+)\}/g
const RE_SCRIPT_LANG = /<script\s+(?:type|lang)=["']([^"']+)["']/gi

/**
 * Creates a converter between index and position in a code block.
 *
 * Overflow/underflow are unchecked.
 *
 * Uses a `Uint32Array` prefix-sum of line lengths so `indexToPos` and
 * `posToIndex` are O(log lines) and O(1) respectively, rather than the
 * O(lines) linear scan that the naive form needs. Decoration transformers
 * call these per offset / per decoration / per breakpoint, so the speed-up
 * is meaningful on large files.
 */
export function createPositionConverter(code: string): {
  lines: string[]
  indexToPos: (index: number) => Position
  posToIndex: (line: number, character: number) => number
} {
  const lines = splitLines(code, true).map(([line]) => line)

  // `lineStarts[i]` is the index of the first character of line `i`.
  // `lineStarts[lines.length]` = code.length (sentinel for end-of-file).
  const lineStarts = new Uint32Array(lines.length + 1)
  for (let i = 0, acc = 0; i < lines.length; i++) {
    lineStarts[i] = acc
    acc += lines[i].length
  }
  lineStarts[lines.length] = code.length

  function indexToPos(index: number): Position {
    if (index === code.length) {
      return {
        line: lines.length - 1,
        character: lines.at(-1)!.length,
      }
    }

    // Binary search for the largest `lineStarts[line] <= index`.
    let lo = 0
    let hi = lines.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >>> 1
      if (lineStarts[mid] <= index)
        lo = mid
      else
        hi = mid - 1
    }
    return { line: lo, character: index - lineStarts[lo] }
  }

  function posToIndex(line: number, character: number): number {
    return lineStarts[line] + character
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
 *
 * @param code - The code string to analyze
 * @param _lang - The primary language of the code (currently unused)
 * @param highlighter - Optional highlighter instance to validate languages
 * @returns Array of detected language identifiers
 *
 * @example
 * ```ts
 * // Detects 'javascript' from Vue SFC
 * guessEmbeddedLanguages('<script lang="javascript">')
 *
 * // Detects 'python' from markdown code block
 * guessEmbeddedLanguages('```python\nprint("hi")\n```')
 * ```
 */
export function guessEmbeddedLanguages(
  code: string,
  _lang: string | undefined,
  highlighter?: HighlighterGeneric<any, any>,
): string[] {
  const langs = new Set<string>()

  // For HTML code blocks like Vue SFC, support both single and double quotes
  // Matches: lang="js", lang='ts', :lang="typescript", etc.
  // Allow spaces around the language name
  for (const match of code.matchAll(RE_LANG_ATTR)) {
    const lang = match[1].toLowerCase().trim()
    if (lang)
      langs.add(lang)
  }

  // For markdown code blocks, support both ``` and ~~~ fences
  // Matches: ```typescript, ~~~javascript, etc.
  for (const match of code.matchAll(RE_CODE_FENCE)) {
    const lang = match[1].toLowerCase().trim()
    if (lang)
      langs.add(lang)
  }

  // For LaTeX environments
  // Matches: \begin{equation}, \begin{align}, etc.
  for (const match of code.matchAll(RE_LATEX_BEGIN)) {
    const lang = match[1].toLowerCase().trim()
    if (lang)
      langs.add(lang)
  }

  // For script tags in HTML/Vue
  // Matches: <script type="text/javascript">, <script lang="ts">, etc.
  // Allow spaces around the language name
  for (const match of code.matchAll(RE_SCRIPT_LANG)) {
    // Extract language from MIME types like 'text/javascript' or 'application/typescript'
    const fullType = match[1].toLowerCase().trim()
    const lang = fullType.includes('/') ? fullType.split('/').pop() : fullType
    if (lang)
      langs.add(lang)
  }

  if (!highlighter)
    return [...langs]

  // Only include known languages
  const bundle = highlighter.getBundledLanguages()
  return [...langs]
    .filter(l => l && bundle[l])
}
