import { describe, expect, it } from 'vitest'
import { codeToHtml, codeToThemedTokens } from '../src'

describe('should', () => {
  it('codeToHtml', async () => {
    expect(await codeToHtml('console.log("hello")', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot('"<pre class=\\"shiki vitesse-light\\" style=\\"background-color: #ffffff; color: #ffffff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #B07D48\\">console</span><span style=\\"color: #999999\\">.</span><span style=\\"color: #59873A\\">log</span><span style=\\"color: #999999\\">(</span><span style=\\"color: #B5695999\\">&quot;</span><span style=\\"color: #B56959\\">hello</span><span style=\\"color: #B5695999\\">&quot;</span><span style=\\"color: #999999\\">)</span></span></code></pre>"')

    expect(await codeToHtml('<div class="foo">bar</div>', { lang: 'html', theme: 'min-dark' }))
      .toMatchInlineSnapshot('"<pre class=\\"shiki min-dark\\" style=\\"background-color: #1f1f1f; color: #1f1f1f\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #B392F0\\">&lt;</span><span style=\\"color: #FFAB70\\">div</span><span style=\\"color: #B392F0\\"> class</span><span style=\\"color: #F97583\\">=</span><span style=\\"color: #FFAB70\\">&quot;foo&quot;</span><span style=\\"color: #B392F0\\">&gt;bar&lt;/</span><span style=\\"color: #FFAB70\\">div</span><span style=\\"color: #B392F0\\">&gt;</span></span></code></pre>"')
  })

  it('codeToThemedTokens', async () => {
    expect(await codeToThemedTokens('console.log("hello")', { lang: 'js', theme: 'vitesse-dark', includeExplanation: false }))
      .toMatchInlineSnapshot(`
        [
          [
            {
              "color": "#BD976A",
              "content": "console",
              "explanation": [],
              "fontStyle": 0,
            },
            {
              "color": "#666666",
              "content": ".",
              "explanation": [],
              "fontStyle": 0,
            },
            {
              "color": "#80A665",
              "content": "log",
              "explanation": [],
              "fontStyle": 0,
            },
            {
              "color": "#666666",
              "content": "(",
              "explanation": [],
              "fontStyle": 0,
            },
            {
              "color": "#C98A7D99",
              "content": "\\"",
              "explanation": [],
              "fontStyle": 0,
            },
            {
              "color": "#C98A7D",
              "content": "hello",
              "explanation": [],
              "fontStyle": 0,
            },
            {
              "color": "#C98A7D99",
              "content": "\\"",
              "explanation": [],
              "fontStyle": 0,
            },
            {
              "color": "#666666",
              "content": ")",
              "explanation": [],
              "fontStyle": 0,
            },
          ],
        ]
      `)
  })
})
