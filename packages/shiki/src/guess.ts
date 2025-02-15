import type { HighlighterGeneric } from '@shikijs/types'

export function guessEmbeddedLanguages(
  code: string,
  _lang: string | undefined,
  shiki: HighlighterGeneric<any, any>,
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

  // Only include known languages
  const bundle = shiki.getBundledLanguages()
  return Array.from(langs)
    .filter(l => l && bundle[l])
}
