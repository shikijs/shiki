import { describe, expect, it } from 'vitest'
import { getHighlighter } from '../src/core'

import js from '../dist/languages/javascript.mjs'
import nord from '../dist/themes/nord.mjs'

// @ts-expect-error no-types
import onig from '../dist/onig.mjs'

describe('should', () => {
  it('exported', async () => {
    const shiki = await getHighlighter({
      themes: [nord],
      langs: [js],
      loadWasm: {
        instantiator: obj => WebAssembly.instantiate(onig, obj),
      },
    })

    expect(shiki.codeToHtml('console.log', { lang: 'javascript' }))
      .toMatchInlineSnapshot('"<pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #D8DEE9\\">log</span></span></code></pre>"')
  })
})
