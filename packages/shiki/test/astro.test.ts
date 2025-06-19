import { createHighlighter } from 'shiki'
import { describe, expect, it } from 'vitest'

describe('should', async () => {
  it('astro syntax highlighting', async () => {
    const highlighter = await createHighlighter({
      langs: ['astro'],
      themes: ['vitesse-dark'],
    })
    const code = `---
const title = "Astro";
---

<p>{title}</p>
`
    expect(highlighter.codeToHtml(code, { lang: 'astro', theme: 'vitesse-dark' })).toMatchInlineSnapshot(`
      "<pre class="shiki vitesse-dark" style="background-color:#121212;color:#dbd7caee" tabindex="0"><code><span class="line"><span style="color:#758575DD">---</span></span>
      <span class="line"><span style="color:#CB7676">const </span><span style="color:#BD976A">title</span><span style="color:#666666"> =</span><span style="color:#C98A7D77"> "</span><span style="color:#C98A7D">Astro</span><span style="color:#C98A7D77">"</span><span style="color:#666666">;</span></span>
      <span class="line"><span style="color:#758575DD">---</span></span>
      <span class="line"></span>
      <span class="line"><span style="color:#666666">&#x3C;</span><span style="color:#4D9375">p</span><span style="color:#666666">>{</span><span style="color:#BD976A">title</span><span style="color:#666666">}&#x3C;/</span><span style="color:#4D9375">p</span><span style="color:#666666">></span></span>
      <span class="line"></span></code></pre>"
    `)
    highlighter.dispose()
  })
})
