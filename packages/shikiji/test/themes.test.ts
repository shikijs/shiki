import { describe, expect, it } from 'vitest'
import type { ThemedToken } from '../src'
import { codeToHtml, codeToThemedTokens, codeToTokensWithThemes } from '../src'
import { syncThemesTokenization } from '../src/core/renderer-html-themes'

describe('syncThemesTokenization', () => {
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

    const [out1, out2] = syncThemesTokenization(lines1, lines2)

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

    const [out1, out2, out3] = syncThemesTokenization(lines1, lines2, lines3)

    expect(stringifyTokens(out1))
      .toBe(stringifyTokens(out2))

    expect(stringifyTokens(out2))
      .toBe(stringifyTokens(out3))

    expect(stringifyTokens(out1))
      .toMatchInlineSnapshot('"console . log ( \\" hello \\" ) ;"')
  })
})

describe('codeToHtml', () => {
  it('dual themes', async () => {
    const code = await codeToHtml('console.log("hello")', {
      lang: 'js',
      themes: {
        dark: 'nord',
        light: 'min-light',
      },
    })

    const snippet = `
<style>
.dark .shiki,
.dark .shiki span {
  background-color: var(--shiki-dark-bg) !important;
  color: var(--shiki-dark) !important;
}
</style>
<button onclick="document.body.classList.toggle('dark')">Toggle theme</button>
`

    expect(snippet + code)
      .toMatchFileSnapshot('./out/dual-themes.html')
  })

  it('multiple themes', async () => {
    const themes = {
      'light': 'vitesse-light',
      'dark': 'vitesse-dark',
      'nord': 'nord',
      'min-dark': 'min-dark',
      'min-light': 'min-light',
      'palenight': 'material-theme-palenight',
    } as const

    const code = await codeToHtml('import * as Shiki from "shikiji"', {
      lang: 'js',
      themes,
      cssVariablePrefix: '--s-',
    })

    const snippet = `
<style>
.shiki {
  padding: 0.5em;
  border-radius: 0.25em;
}

${Object.keys(themes).map(theme => `
[data-theme="${theme}"] .shiki,
[data-theme="${theme}"] .shiki span {
  background-color: var(--s-${theme}-bg) !important;
  color: var(--s-${theme}) !important;
  font-style: var(--s-${theme}-font-style) !important;
  font-weight: var(--s-${theme}-font-weight) !important;
  text-decoration: var(--s-${theme}-text-decoration) !important;
}
`).join('\n')}
</style>
<script>
const themes = ${JSON.stringify(Object.keys(themes))}

function toggleTheme() {
  document.body.dataset.theme = themes[(Math.max(themes.indexOf(document.body.dataset.theme), 0) + 1) % themes.length]
}
</script>
<button onclick="toggleTheme()">Toggle theme</button>
`

    expect(snippet + code)
      .toMatchFileSnapshot('./out/multiple-themes.html')
  })

  it('multiple themes without default', async () => {
    const themes = {
      'light': 'vitesse-light',
      'dark': 'vitesse-dark',
      'nord': 'nord',
      'min-dark': 'min-dark',
      'min-light': 'min-light',
    } as const

    const code = await codeToHtml('console.log("hello")', {
      lang: 'js',
      themes,
      defaultColor: false,
      cssVariablePrefix: '--s-',
    })

    const snippet = `
<style>
.shiki {
  padding: 0.5em;
  border-radius: 0.25em;
}

.shiki,
.shiki span {
  background-color: var(--s-light-bg);
  color: var(--s-light);
}

${Object.keys(themes).map(theme => `
[data-theme="${theme}"] .shiki,
[data-theme="${theme}"] .shiki span {
  background-color: var(--s-${theme}-bg) !important;
  color: var(--s-${theme}) !important;
}
`).join('\n')}
</style>
<script>
const themes = ${JSON.stringify(Object.keys(themes))}

function toggleTheme() {
  document.body.dataset.theme = themes[(Math.max(themes.indexOf(document.body.dataset.theme), 0) + 1) % themes.length]
}
</script>
<button onclick="toggleTheme()">Toggle theme</button>
`

    expect(snippet + code)
      .toMatchFileSnapshot('./out/multiple-themes-no-default.html')
  })

  it('should support font style', async () => {
    const input = 'import * as Shiki from \'shiki\';\n'
    const code1 = await codeToHtml(input, {
      lang: 'js',
      themes: {
        light: 'material-theme-palenight',
        dark: 'nord',
      },
    })

    expect(code1)
      .toContain('font-style:italic;--shiki-dark-font-style:inherit')

    const code2 = await codeToHtml(input, {
      lang: 'js',
      themes: {
        light: 'material-theme-palenight',
        dark: 'nord',
      },
      defaultColor: 'dark',
    })

    expect(code2)
      .toContain('font-style:inherit;--shiki-light-font-style:italic')
  })

  it('should not have empty style', async () => {
    const input = 'This is plain text'
    const code = await codeToHtml(input, {
      lang: 'plaintext',
      themes: {
        light: 'material-theme-palenight',
        dark: 'nord',
      },
    })
    expect(code).not.toContain('style=""')
  })
})

describe('codeToTokensWithThemes', () => {
  it('generates', async () => {
    const themes = {
      'light': 'vitesse-light',
      'dark': 'vitesse-dark',
      'nord': 'nord',
      'min-dark': 'min-dark',
      'min-light': 'min-light',
    } as const

    const code = await codeToTokensWithThemes('a.b', {
      lang: 'js',
      themes,
    })

    expect(code)
      .toMatchInlineSnapshot(`
        [
          [
            "light",
            "vitesse-light",
            [
              [
                {
                  "color": "#B07D48",
                  "content": "a",
                  "fontStyle": 0,
                },
                {
                  "color": "#999999",
                  "content": ".",
                  "fontStyle": 0,
                },
                {
                  "color": "#B07D48",
                  "content": "b",
                  "fontStyle": 0,
                },
              ],
            ],
          ],
          [
            "dark",
            "vitesse-dark",
            [
              [
                {
                  "color": "#BD976A",
                  "content": "a",
                  "fontStyle": 0,
                },
                {
                  "color": "#666666",
                  "content": ".",
                  "fontStyle": 0,
                },
                {
                  "color": "#BD976A",
                  "content": "b",
                  "fontStyle": 0,
                },
              ],
            ],
          ],
          [
            "nord",
            "nord",
            [
              [
                {
                  "color": "#D8DEE9",
                  "content": "a",
                  "fontStyle": 0,
                },
                {
                  "color": "#ECEFF4",
                  "content": ".",
                  "fontStyle": 0,
                },
                {
                  "color": "#D8DEE9",
                  "content": "b",
                  "fontStyle": 0,
                },
              ],
            ],
          ],
          [
            "min-dark",
            "min-dark",
            [
              [
                {
                  "color": "#79B8FF",
                  "content": "a",
                  "fontStyle": 0,
                },
                {
                  "color": "#B392F0",
                  "content": ".",
                  "fontStyle": 0,
                },
                {
                  "color": "#B392F0",
                  "content": "b",
                  "fontStyle": 0,
                },
              ],
            ],
          ],
          [
            "min-light",
            "min-light",
            [
              [
                {
                  "color": "#1976D2",
                  "content": "a",
                  "fontStyle": 0,
                },
                {
                  "color": "#24292EFF",
                  "content": ".",
                  "fontStyle": 0,
                },
                {
                  "color": "#24292EFF",
                  "content": "b",
                  "fontStyle": 0,
                },
              ],
            ],
          ],
        ]
      `)
  })
})

describe('errors', () => {
  it('throws on empty theme', async () => {
    expect(() => codeToHtml('console.log("hello")', {
      lang: 'js',
      themes: {},
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot('"[shikiji] `themes` option must not be empty"')
  })

  it('throws on missing default color', async () => {
    expect(() => codeToHtml('console.log("hello")', {
      lang: 'js',
      themes: {
        dark: 'nord',
      },
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot('"[shikiji] `themes` option must contain the defaultColor key `light`"')

    expect(() => codeToHtml('console.log("hello")', {
      lang: 'js',
      themes: {
        light: 'nord',
      },
      defaultColor: 'dark',
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot('"[shikiji] `themes` option must contain the defaultColor key `dark`"')
  })

  it('not throws when `defaultColor` set to false', async () => {
    const code = await codeToHtml('console.log("hello")', {
      lang: 'js',
      themes: {
        dark: 'nord',
      },
      defaultColor: false,
    })

    expect(code).toMatchInlineSnapshot('"<pre class=\\"shiki shiki-themes nord\\" style=\\"--shiki-dark:#d8dee9ff;--shiki-dark-bg:#2e3440ff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"--shiki-dark:#D8DEE9\\">console</span><span style=\\"--shiki-dark:#ECEFF4\\">.</span><span style=\\"--shiki-dark:#88C0D0\\">log</span><span style=\\"--shiki-dark:#D8DEE9FF\\">(</span><span style=\\"--shiki-dark:#ECEFF4\\">\\"</span><span style=\\"--shiki-dark:#A3BE8C\\">hello</span><span style=\\"--shiki-dark:#ECEFF4\\">\\"</span><span style=\\"--shiki-dark:#D8DEE9FF\\">)</span></span></code></pre>"')
  })
})
