import { expect, it } from 'vitest'
// eslint-disable-next-line antfu/no-import-dist
import { createHighlighter } from '../dist/index.mjs'

it('should works', async () => {
  const shiki = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['javascript'],
  })

  expect(shiki.codeToHtml('console.log', { lang: 'js', theme: 'vitesse-light' }))
    .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span></span></code></pre>"`)
})
