import type { BundledLanguage, BundledTheme, ThemedToken, ThemedTokenWithVariants } from '../src'
import { alignThemesTokenization } from '@shikijs/primitive'
import { describe, expect, it } from 'vitest'
import { createHighlighter } from '../src'

const samples: Partial<Record<BundledLanguage, string>> = {
  ts: `
import { readFile } from 'node:fs/promises'

/** Doc comment with a {@link readFile} */
export async function load<T extends object>(path: string): Promise<T> {
  const text = await readFile(path, 'utf8')
  return JSON.parse(text) as T // trailing comment
}
`,
  html: `
<!doctype html>
<style>
  .a > b { color: red; }
</style>
<script>
  const x = \`template \${1 + 2}\`
</script>
<p class="x">Hello <b>world</b></p>
`,
  md: `
# Title

Some *emphasis*, **strong** and \`code\`.

\`\`\`ts
const a: number = 1
\`\`\`
`,
}

const themeSets: Record<string, BundledTheme>[] = [
  { light: 'github-light', dark: 'github-dark' },
  { light: 'min-light', dark: 'nord', dim: 'vitesse-dark' },
]

const highlighter = await createHighlighter({
  langs: [...Object.keys(samples) as BundledLanguage[], 'json'],
  themes: [...new Set(themeSets.flatMap(Object.values))],
})

function perTheme(tokens: ThemedTokenWithVariants[][], key: string): ThemedToken[][] {
  return tokens.map(line => line.map(t => ({ content: t.content, offset: t.offset, ...t.variants[key] })))
}

describe('codeToTokensWithThemes scans once', () => {
  for (const [lang, code] of Object.entries(samples) as [BundledLanguage, string][]) {
    for (const themes of themeSets) {
      it(`${lang} ${Object.values(themes).join(' ')}`, () => {
        const keys = Object.keys(themes)
        const names = keys.map(k => themes[k])

        const tokens = highlighter.codeToTokensWithThemes(code, { lang, themes })
        const expected = alignThemesTokenization(
          ...names.map(theme => highlighter.codeToTokensBase(code, { lang, theme })),
        )
        keys.forEach((key, i) => {
          expect(perTheme(tokens, key)).toEqual(expected[i].map(line => line.map(t => ({ content: t.content, offset: t.offset, color: t.color, fontStyle: t.fontStyle }))))
        })

        // Each theme gets its own grammar state, equal to the one of a single-theme tokenization
        const state = highlighter.getLastGrammarState(tokens)!
        for (const name of names) {
          const single = highlighter.getLastGrammarState(code, { lang, theme: name })
          expect((state.getInternalStack(name) as any).equals(single.getInternalStack(name))).toBe(true)
        }
      })
    }
  }

  it('continues from a grammar state', () => {
    const themes = themeSets[1]
    const [head, tail] = ['```ts\nconst a = `x', 'y`\n```\nplain']
    const state = highlighter.getLastGrammarState(highlighter.codeToTokensWithThemes(head, { lang: 'md', themes }))
    const tokens = highlighter.codeToTokensWithThemes(tail, { lang: 'md', themes, grammarState: state })
    for (const [key, theme] of Object.entries(themes)) {
      const single = highlighter.codeToTokensBase(tail, { lang: 'md', theme, grammarState: state })
      const colors = (lines: ThemedToken[][]): string => lines.map(l => l.flatMap(t => [...t.content].map(() => `${t.color}/${t.fontStyle}`))).join('\n')
      expect(colors(perTheme(tokens, key))).toBe(colors(single))
    }
  })

  it('returns a usable grammar state for empty code', () => {
    const themes = themeSets[0]
    const state = highlighter.getLastGrammarState(highlighter.codeToTokensWithThemes('\n', { lang: 'ts', themes }))
    for (const theme of Object.values(themes)) {
      expect(highlighter.codeToTokensBase('const a = 1', { lang: 'ts', theme, grammarState: state }))
        .toEqual(highlighter.codeToTokensBase('const a = 1', { lang: 'ts', theme }))
    }
  })

  it('handles long lines and deep nesting', () => {
    const themes = themeSets[0]
    const deep = '['.repeat(2000)
    for (const code of [`[1, ${'"x", '.repeat(200)}2]`, deep, `${'[\n'.repeat(80)}1`]) {
      const tokens = highlighter.codeToTokensWithThemes(code, { lang: 'json', themes })
      const expected = alignThemesTokenization(
        ...Object.values(themes).map(theme => highlighter.codeToTokensBase(code, { lang: 'json', theme })),
      )
      expect(perTheme(tokens, 'dark').map(l => l.map(t => t.color))).toEqual(expected[1].map(l => l.map(t => t.color)))
    }
    // Continuing from a deep state must not overflow the call stack
    const state = highlighter.getLastGrammarState(highlighter.codeToTokensWithThemes(deep, { lang: 'json', themes }))
    expect(() => highlighter.codeToTokensWithThemes('1', { lang: 'json', themes, grammarState: state })).not.toThrow()
  })

  it('tokenizes each line once', () => {
    const grammar = highlighter.getLanguage('ts')
    const tokenizeLine = grammar.tokenizeLine.bind(grammar)
    const tokenizeLine2 = grammar.tokenizeLine2.bind(grammar)
    let calls = 0
    grammar.tokenizeLine = (...args) => {
      calls += 1
      return tokenizeLine(...args)
    }
    grammar.tokenizeLine2 = (...args) => {
      calls += 1
      return tokenizeLine2(...args)
    }
    try {
      highlighter.codeToTokensWithThemes(samples.ts!, { lang: 'ts', themes: themeSets[1] })
    }
    finally {
      delete (grammar as any).tokenizeLine
      delete (grammar as any).tokenizeLine2
    }
    expect(calls).toBe(samples.ts!.split('\n').filter(Boolean).length)
  })
})
