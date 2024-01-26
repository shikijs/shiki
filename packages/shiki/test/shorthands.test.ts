import { describe, expect, it } from 'vitest'
import { codeToHtml, codeToThemedTokens } from '../src'

describe('should', () => {
  it('codeToHtml', async () => {
    expect(await codeToHtml('console.log("hello")', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#59873A">log</span><span style="color:#999999">(</span><span style="color:#B5695999">"</span><span style="color:#B56959">hello</span><span style="color:#B5695999">"</span><span style="color:#999999">)</span></span></code></pre>"`)

    expect(await codeToHtml('<div class="foo">bar</div>', { lang: 'html', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`"<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#B392F0">&#x3C;</span><span style="color:#FFAB70">div</span><span style="color:#B392F0"> class</span><span style="color:#F97583">=</span><span style="color:#FFAB70">"foo"</span><span style="color:#B392F0">>bar&#x3C;/</span><span style="color:#FFAB70">div</span><span style="color:#B392F0">></span></span></code></pre>"`)
  })

  it('codeToThemedTokens', async () => {
    expect(await codeToThemedTokens('console.log("hello")', { lang: 'js', theme: 'vitesse-dark', includeExplanation: false }))
      .toMatchInlineSnapshot(`
        [
          [
            {
              "color": "#BD976A",
              "content": "console",
              "fontStyle": 0,
              "offset": 0,
            },
            {
              "color": "#666666",
              "content": ".",
              "fontStyle": 0,
              "offset": 7,
            },
            {
              "color": "#80A665",
              "content": "log",
              "fontStyle": 0,
              "offset": 8,
            },
            {
              "color": "#666666",
              "content": "(",
              "fontStyle": 0,
              "offset": 11,
            },
            {
              "color": "#C98A7D99",
              "content": """,
              "fontStyle": 0,
              "offset": 12,
            },
            {
              "color": "#C98A7D",
              "content": "hello",
              "fontStyle": 0,
              "offset": 13,
            },
            {
              "color": "#C98A7D99",
              "content": """,
              "fontStyle": 0,
              "offset": 18,
            },
            {
              "color": "#666666",
              "content": ")",
              "fontStyle": 0,
              "offset": 19,
            },
          ],
        ]
      `)
  })
})
