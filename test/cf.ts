import { getHighlighter, loadWasm } from '../src/core'

// @ts-expect-error no-types
import nord from '../dist/themes/nord.mjs'

// @ts-expect-error no-types
import js from '../dist/languages/javascript.mjs'

// @ts-expect-error no-types
import wasm from '../dist/onig.wasm'

await loadWasm(obj => WebAssembly.instantiate(wasm, obj))

export default {
  async fetch() {
    const highlighter = await getHighlighter({
      themes: [nord],
      langs: [js],
    })

    return new Response(highlighter.codeToHtml('console.log(\'shiki\');', { lang: 'js' }))
  },
}
