import { describe, expect, it } from 'vitest'
import type { ThemedToken } from '../src'
import { codeToHtmlDualThemes, codeToThemedTokens } from '../src'
import { _syncThemedTokens } from '../src/core/renderer-html-dual-themes'

describe('syncThemedTokens', () => {
  function stringifyTokens(tokens: ThemedToken[][]) {
    return tokens.map(line => line.map(token => token.content).join(' ')).join('\n')
  }

  it('two themes', async () => {
    const lines1 = await codeToThemedTokens('console.log("hello")', { lang: 'js', theme: 'vitesse-dark', includeExplanation: true })
    const lines2 = await codeToThemedTokens('console.log("hello")', { lang: 'js', theme: 'min-light', includeExplanation: true })

    expect(stringifyTokens(lines1))
      .toMatchInlineSnapshot('"console . log ( \\" hello \\" )"')
    expect(stringifyTokens(lines2))
      .toMatchInlineSnapshot('"console .log ( \\"hello\\" )"')

    const [out1, out2] = _syncThemedTokens(lines1, lines2)

    expect(stringifyTokens(out1))
      .toBe(stringifyTokens(out2))
  })

  it('three themes', async () => {
    const lines1 = await codeToThemedTokens('console.log("hello");', { lang: 'js', theme: 'vitesse-dark', includeExplanation: true })
    const lines2 = await codeToThemedTokens('console.log("hello");', { lang: 'js', theme: 'min-light', includeExplanation: true })
    const lines3 = await codeToThemedTokens('console.log("hello");', { lang: 'js', theme: 'nord', includeExplanation: true })

    expect(stringifyTokens(lines1))
      .toMatchInlineSnapshot('"console . log ( \\" hello \\" );"')
    expect(stringifyTokens(lines2))
      .toMatchInlineSnapshot('"console .log ( \\"hello\\" );"')
    expect(stringifyTokens(lines3))
      .toMatchInlineSnapshot('"console . log ( \\" hello \\" ) ;"')

    const [out1, out2, out3] = _syncThemedTokens(lines1, lines2, lines3)

    expect(stringifyTokens(out1))
      .toBe(stringifyTokens(out2))

    expect(stringifyTokens(out2))
      .toBe(stringifyTokens(out3))

    expect(stringifyTokens(out1))
      .toMatchInlineSnapshot('"console . log ( \\" hello \\" ) ;"')
  })
})

describe('codeToHtmlDualThemes', () => {
  it('dual themes', async () => {
    const code = await codeToHtmlDualThemes('console.log("hello")', {
      lang: 'js',
      themes: {
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

  it('multiple themes', async () => {
    const code = await codeToHtmlDualThemes('console.log("hello")', {
      lang: 'js',
      themes: {
        'light': 'vitesse-light',
        'dark': 'vitesse-dark',
        'nord': 'nord',
        'min-dark': 'min-dark',
        'min-light': 'min-light',
      },
      cssVariablePrefix: '--s-',
    })

    const snippet = `
<style>
.shiki {
  padding: 0.5em;
  border-radius: 0.25em;
}

[data-theme="dark"] .shiki {
  background-color: var(--s-dark-bg) !important;
  color: var(--s-dark) !important;
}
[data-theme="dark"] .shiki span {
  color: var(--s-dark) !important;
}

[data-theme="nord"] .shiki {
  background-color: var(--s-nord-bg) !important;
  color: var(--s-nord) !important;
}
[data-theme="nord"] .shiki span {
  color: var(--s-nord) !important;
}

[data-theme="min-dark"] .shiki {
  background-color: var(--s-min-dark-bg) !important;
  color: var(--s-min-dark) !important;
}
[data-theme="min-dark"] .shiki span {
  color: var(--s-min-dark) !important;
}

[data-theme="min-light"] .shiki {
  background-color: var(--s-min-light-bg) !important;
  color: var(--s-min-light) !important;
}
[data-theme="min-light"] .shiki span {
  color: var(--s-min-light) !important;
}
</style>
<script>
const themes = ['light', 'dark', 'nord', 'min-dark', 'min-light']

function toggleTheme() {
  document.body.dataset.theme = themes[(Math.max(themes.indexOf(document.body.dataset.theme), 0) + 1) % themes.length]
}
</script>
<button onclick="toggleTheme()">Toggle theme</button>
`

    expect(snippet + code)
      .toMatchFileSnapshot('./out/multiple-themes.html')
  })
})
