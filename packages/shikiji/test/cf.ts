import { getHighlighterCore, loadWasm } from 'shikiji/core'

import nord from 'shikiji/themes/nord.mjs'
import js from 'shikiji/langs/javascript.mjs'

// @ts-expect-error no types
import wasm from '../dist/onig.wasm'

await loadWasm(obj => WebAssembly.instantiate(wasm, obj))

export default {
  async fetch() {
    const highlighter = await getHighlighterCore({
      themes: [nord],
      langs: [js],
    })

    return new Response(
      highlighter.codeToHtml('console.log(\'shiki\');', { lang: 'js', theme: 'nord' }),
      {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      },
    )
  },
}
