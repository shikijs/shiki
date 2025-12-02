import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'

it('repro #1164', async () => {
  const highlighter = await createHighlighter({
    langs: [],
    langAlias: {
      gitignore: 'text',
    },
    themes: [],
    engine: createJavaScriptRegexEngine(),
  })

  await highlighter.loadLanguage('gitignore' as any)

  expect(highlighter.codeToHtml('foo', { lang: 'gitignore', theme: 'none' }))
    .toMatchInlineSnapshot(`"<pre class="shiki none" style="background-color:;color:" tabindex="0"><code><span class="line"><span>foo</span></span></code></pre>"`)
})
