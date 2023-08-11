import { getHighlighter, loadWASM } from '../src/core'

// @ts-expect-error no-types
import nord from '../dist/themes/nord.mjs'

// @ts-expect-error no-types
import js from '../dist/languages/javascript.mjs'

// @ts-expect-error no-types
import wasm from '../dist/onig.wasm'

await loadWASM(obj => WebAssembly.instantiate(wasm, obj))

export default {
  async fetch() {
    const highlighter = await getHighlighter({
      themes: [nord],
      langs: [js],
      getOnigurumaWasm: false,
    })

    return new Response(highlighter.codeToHtml('console.log(\'shiki\');', { lang: 'js' }))
  },
}
