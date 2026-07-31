import type { HighlighterGeneric, Position } from '@shikijs/types'
import { splitLines } from '@shikijs/primitive'

const RE_LANG_ATTR = /:?lang=["']([^"']+)["']/g
const RE_CODE_FENCE = /(?:```|~~~)([\w-]+)/g
const RE_LATEX_BEGIN = /\\begin\{([\w-]+)\}/g
const RE_SCRIPT_LANG = /<script\s+(?:type|lang)=["']([^"']+)["']/gi
// Matches a YAML/frontmatter block delimited by `---` at the very start of
// the document, e.g.:
// ---
// foo: bar
// ---
const RE_FRONTMATTER = /^\s*---\r?\n[\s\S]*?\r?\n---(?:\r?\n|\s*$)/

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
        character: lines.at(-1)!.length,
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

  // For frontmatter blocks (commonly found in markdown files)
  // Matches: ---\nfoo: bar\n---
  // Frontmatter is most commonly YAML (or JSON, which is a subset of YAML),
  // so loading the YAML grammar is enough to cover both cases.
  if (RE_FRONTMATTER.test(code))
    langs.add('yaml')

  if (!highlighter)
    return [...langs]

  // Only include known languages
  const bundle = highlighter.getBundledLanguages()
  return [...langs]
    .filter(l => l && bundle[l])
}
