import { createHighlighterCore } from 'shiki/core'
import { expect, it } from 'vitest'
import { createJavaScriptRegexEngine } from '../src'

it('work with precompile grammar', async () => {
  const shiki = await createHighlighterCore({
    themes: [
      import('@shikijs/themes/vitesse-light'),
    ],
    langs: [
      import('@shikijs/langs-precompiled/js'),
    ],
    engine: createJavaScriptRegexEngine(),
  })

  expect(
    shiki.codeToHtml('console.log', { lang: 'js', theme: 'vitesse-light' }),
  )
    .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span></span></code></pre>"`)
})
