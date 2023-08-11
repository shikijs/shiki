import { getHighlighter } from './src/core'
import nord from './dist/themes/nord.mjs'
import js from './dist/languages/javascript.mjs'
import wasm from './dist/onig.wasm'

export default {
  async fetch() {
    const highlighter = await getHighlighter({
      themes: [nord],
      langs: [js],
      async getOnigurumaWasm() {
        return {
          instantiator: importObject => WebAssembly.instantiate(wasm, importObject),
        }
      },
    })
    return new Response(highlighter.codeToHtml('console.log(\'shiki\');', { lang: 'js' }))
  },
}
