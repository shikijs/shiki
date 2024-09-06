import { describe, expect, it } from 'vitest'
import js from '../src/assets/langs/javascript'

import nord from '../src/assets/themes/nord'
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from '../src/core'

describe('should', () => {
  const engine = createJavaScriptRegexEngine()

  it('works', () => {
    const shiki = createHighlighterCoreSync({
      themes: [nord],
      langs: [js],
      engine,
    })

    expect(shiki.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'nord' }))
      .toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#D8DEE9">console</span><span style="color:#ECEFF4">.</span><span style="color:#88C0D0">log</span><span style="color:#D8DEE9FF">(</span><span style="color:#ECEFF4">"</span><span style="color:#A3BE8C">Hi</span><span style="color:#ECEFF4">"</span><span style="color:#D8DEE9FF">)</span></span></code></pre>"`)
  })

  it('dynamic load sync theme and lang', async () => {
    const shiki = createHighlighterCoreSync({
      themes: [nord],
      langs: [
        js,
        // Load the grammar upfront (await outside of the function)
        await import('../src/assets/langs/c').then(r => r.default),
      ],
      engine,
    })

    shiki.loadLanguageSync(await import('../src/assets/langs/python').then(m => m.default))
    shiki.loadThemeSync(await import('../dist/themes/vitesse-light.mjs').then(m => m.default))

    expect(shiki.getLoadedLanguages())
      .toMatchInlineSnapshot(`
        [
          "javascript",
          "c",
          "python",
          "js",
          "py",
        ]
      `)
    expect(shiki.getLoadedThemes())
      .toMatchInlineSnapshot(`
        [
          "nord",
          "vitesse-light",
        ]
      `)

    expect(shiki.codeToHtml('print 1', { lang: 'python', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#998418">print</span><span style="color:#2F798A"> 1</span></span></code></pre>"`)
  })
})
