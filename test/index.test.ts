import { describe, expect, it } from 'vitest'
import { getHighlighter } from '../src'

describe('should', () => {
  it('exported', async () => {
    const shiki = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    expect(shiki.codeToHtml('console.log', { lang: 'javascript' }))
      .toMatchInlineSnapshot('"<pre class=\\"shiki vitesse-light\\" style=\\"background-color: #ffffff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #B07D48\\">console</span><span style=\\"color: #999999\\">.</span><span style=\\"color: #B07D48\\">log</span></span></code></pre>"')
  })
})
