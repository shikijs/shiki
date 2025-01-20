import type { LanguageRegistration } from '@shikijs/types'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'
import js from '@shikijs/langs/javascript'
import nord from '@shikijs/themes/nord'

import { createHighlighterCore } from 'shiki/core'
// @ts-expect-error no types
// eslint-disable-next-line antfu/no-import-dist
import wasm from '../dist/onig.wasm'

export default {
  async fetch() {
    const highlighter = await createHighlighterCore({
      themes: [nord],
      langs: [js as LanguageRegistration[]],
      // cloudflare also supports dynamic import
      // engine: createOnigurumaEngine(import('shiki/onig.wasm')),
      engine: createOnigurumaEngine(wasm),
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
