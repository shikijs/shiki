import { describe, expect, it } from 'vitest'
import { getHighlighter } from '../src'

describe('none theme', () => {
  it('works', async () => {
    const shiki = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    expect(shiki.codeToHtml('console.log', { lang: 'js', theme: 'none' }))
      .toMatchInlineSnapshot(`"<pre class="shiki none" style="background-color:;color:" tabindex="0"><code><span class="line"><span>console.log</span></span></code></pre>"`)
  })

  it('multiple-themes', async () => {
    const shiki = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript', 'ts'],
    })

    expect(shiki.codeToHtml('console.log', {
      lang: 'ts',
      themes: {
        light: 'vitesse-light',
        dark: 'none',
      },
    }))
      .toMatchInlineSnapshot(`"<pre class="shiki shiki-themes vitesse-light none" style="background-color:#ffffff;--shiki-dark-bg:inherit;color:#393a34;--shiki-dark:inherit" tabindex="0"><code><span class="line"><span style="color:#B07D48;--shiki-dark:inherit">console</span><span style="color:#999999;--shiki-dark:inherit">.</span><span style="color:#B07D48;--shiki-dark:inherit">log</span></span></code></pre>"`)
  })
})
