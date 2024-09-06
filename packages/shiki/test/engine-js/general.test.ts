import { describe, expect, it } from 'vitest'
import { createHighlighter, createJavaScriptRegexEngine } from '../../src'

describe('should', () => {
  it('works', async () => {
    const shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
      engine: createJavaScriptRegexEngine(),
    })

    expect(shiki.codeToHtml('console.log', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span></span></code></pre>"`)
  })

  it('dynamic load theme and lang', async () => {
    const shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript', 'ts'],
      engine: createJavaScriptRegexEngine(),
    })

    await shiki.loadLanguage('css')
    await shiki.loadTheme('min-dark')

    expect(shiki.getLoadedLanguages())
      .toMatchInlineSnapshot(`
        [
          "javascript",
          "typescript",
          "css",
          "js",
          "ts",
        ]
      `)
    expect(shiki.getLoadedThemes())
      .toMatchInlineSnapshot(`
        [
          "vitesse-light",
          "min-dark",
        ]
      `)

    expect(shiki.codeToHtml('@media foo { .bar { padding-left: 1px; }}', { lang: 'css', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`"<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#F97583">@media</span><span style="color:#B392F0"> foo { .bar { </span><span style="color:#79B8FF">padding-left</span><span style="color:#F97583">:</span><span style="color:#F8F8F8"> 1px</span><span style="color:#B392F0">; }}</span></span></code></pre>"`)
  })
})
