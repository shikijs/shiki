import { createHighlighterCore } from '@shikijs/core'
import js from '@shikijs/langs/js'
import nord from '@shikijs/themes/nord'
import { createOnigurumaEngine } from 'shiki'
import { expect, it } from 'vitest'

// eslint-disable-next-line antfu/no-import-dist
import { wasmBinary } from '../dist/wasm-inlined.mjs'

it('wasm', async () => {
  const shiki = await createHighlighterCore({
    themes: [nord],
    langs: [js as any],
    engine: createOnigurumaEngine({
      default: obj => WebAssembly.instantiate(wasmBinary, obj).then(r => r.instance.exports),
    }),
  })

  expect(shiki.codeToHtml('1 + 1', { lang: 'javascript', theme: 'nord' }))
    .toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#B48EAD">1</span><span style="color:#81A1C1"> +</span><span style="color:#B48EAD"> 1</span></span></code></pre>"`)
})
