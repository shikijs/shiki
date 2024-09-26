import type { LanguageRegistration } from '@shikijs/types'
import { loadWasm } from '@shikijs/engine-oniguruma'
import { createHighlighterCore } from 'shiki/core'

import js from 'shiki/langs/javascript.mjs'
import nord from 'shiki/themes/nord.mjs'

// @ts-expect-error no types
// eslint-disable-next-line antfu/no-import-dist
import wasm from '../dist/onig.wasm'

// eslint-disable-next-line antfu/no-top-level-await
await loadWasm(wasm)

// cloudflare also supports dynamic import
// await loadWasm(import('../dist/onig.wasm'))

export default {
  async fetch() {
    const highlighter = await createHighlighterCore({
      themes: [nord],
      langs: [js as LanguageRegistration[]],
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
