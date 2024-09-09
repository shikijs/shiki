import { expect, it } from 'vitest'
// eslint-disable-next-line antfu/no-import-dist
import { wasmBinary } from '../../engine-oniguruma/dist/wasm-inlined.mjs'

import js from '../src/assets/langs/javascript'
import nord from '../src/assets/themes/nord'

import { createHighlighterCore } from '../src/core'

it('loadWasm: WebAssembly.Module', async () => {
  const shiki = await createHighlighterCore({
    themes: [nord],
    langs: [js as any],
    loadWasm: WebAssembly.compile(wasmBinary) as any,
  })

  expect(shiki.codeToHtml('1 + 1', { lang: 'javascript', theme: 'nord' }))
    .toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#B48EAD">1</span><span style="color:#81A1C1"> +</span><span style="color:#B48EAD"> 1</span></span></code></pre>"`)
})
