import { expect, it } from 'vitest'
import { createHighlighterCore } from '../src/core'

import js from '../src/assets/langs/javascript'
import nord from '../src/assets/themes/nord'

// eslint-disable-next-line antfu/no-import-dist
import { wasmBinary } from '../../core/dist/wasm-inlined.mjs'

it('wasm', async () => {
  const shiki = await createHighlighterCore({
    themes: [nord],
    langs: [js as any],
    loadWasm: {
      default: obj => WebAssembly.instantiate(wasmBinary, obj).then(r => r.instance.exports),
    },
  })

  expect(shiki.codeToHtml('1 + 1', { lang: 'javascript', theme: 'nord' }))
    .toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#B48EAD">1</span><span style="color:#81A1C1"> +</span><span style="color:#B48EAD"> 1</span></span></code></pre>"`)
})
