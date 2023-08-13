import { describe, expect, it } from 'vitest'
import type { ThemedToken } from '../src'
import { codeToHtmlDualThemes, codeToThemedTokens } from '../src'
import { _syncTwoThemedTokens } from '../src/core/renderer-html-dual-themes'

describe('should', () => {
  it('syncTwoThemedTokens', async () => {
    function stringifyTokens(tokens: ThemedToken[][]) {
      return tokens.map(line => line.map(token => token.content).join('_')).join('\n')
    }

    const lines1 = await codeToThemedTokens('console.log("hello")', { lang: 'js', theme: 'vitesse-dark', includeExplanation: true })
    const lines2 = await codeToThemedTokens('console.log("hello")', { lang: 'js', theme: 'min-light', includeExplanation: true })

    expect(stringifyTokens(lines1))
      .toMatchInlineSnapshot('"console_._log_(_\\"_hello_\\"_)"')
    expect(stringifyTokens(lines2))
      .toMatchInlineSnapshot('"console_.log_(_\\"hello\\"_)"')

    const [out1, out2] = _syncTwoThemedTokens(lines1, lines2)

    expect(stringifyTokens(out1))
      .toBe(stringifyTokens(out2))
  })

  it('codeToHtmlDualThemes', async () => {
    const code = await codeToHtmlDualThemes('console.log("hello")', {
      lang: 'js',
      theme: {
        dark: 'nord',
        light: 'min-light',
      },
    })

    const snippet = `
<style>
.dark .shiki {
  background-color: var(--shiki-dark-bg) !important;
  color: var(--shiki-dark) !important;
}
.dark .shiki span {
  color: var(--shiki-dark) !important;
}
</style>
<button onclick="document.body.classList.toggle('dark')">Toggle theme</button>
`

    expect(snippet + code)
      .toMatchFileSnapshot('./out/dual-themes.html')
  })
})
