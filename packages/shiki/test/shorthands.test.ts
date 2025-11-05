import { describe, expect, it } from 'vitest'
import { codeToHtml, codeToTokensBase } from '../src'

describe('should', () => {
  it('codeToHtml', async () => {
    expect(await codeToHtml('console.log("hello")', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#59873A">log</span><span style="color:#999999">(</span><span style="color:#B5695977">"</span><span style="color:#B56959">hello</span><span style="color:#B5695977">"</span><span style="color:#999999">)</span></span></code></pre>"`)

    expect(await codeToHtml('<div class="foo">bar</div>', { lang: 'html', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`"<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#B392F0">&#x3C;</span><span style="color:#FFAB70">div</span><span style="color:#B392F0"> class</span><span style="color:#F97583">=</span><span style="color:#FFAB70">"foo"</span><span style="color:#B392F0">>bar&#x3C;/</span><span style="color:#FFAB70">div</span><span style="color:#B392F0">></span></span></code></pre>"`)
  })

  it('codeToTokensBase', async () => {
    expect(await codeToTokensBase('console.log("hello")', { lang: 'js', theme: 'vitesse-dark', includeExplanation: false }))
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
              "color": "#C98A7D77",
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
              "color": "#C98A7D77",
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

  it('should allow subsequent valid calls after first invalid language', async () => {
    const lang = 'invalid'
    const code = 'console.log("hello")'
    const theme = 'vitesse-light'

    // First call with invalid language should throw
    await expect(codeToHtml(code, { lang, theme }))
      .rejects
      .toThrow(/Language `invalid` is not included in this bundle/)

    // Subsequent call with valid language should succeed
    const result = await codeToHtml(code, { lang: 'javascript', theme })
    expect(result).toBeTruthy()
    // The HTML contains the code in structured format, check for "console" which appears in the output
    expect(result).toContain('console')
    expect(result).toContain('shiki')
  })
})
