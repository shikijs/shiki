import { describe, expect, it } from 'vitest'
import { codeToHtml } from '../src'

describe('should', () => {
  it('works', async () => {
    expect(await codeToHtml('console.log("hello")', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot('"<pre class=\\"shiki vitesse-light\\" style=\\"background-color: #ffffff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #B07D48\\">console</span><span style=\\"color: #999999\\">.</span><span style=\\"color: #59873A\\">log</span><span style=\\"color: #999999\\">(</span><span style=\\"color: #B5695999\\">&quot;</span><span style=\\"color: #B56959\\">hello</span><span style=\\"color: #B5695999\\">&quot;</span><span style=\\"color: #999999\\">)</span></span></code></pre>"')

    expect(await codeToHtml('<div class="foo">bar</div>', { lang: 'html', theme: 'min-dark' }))
      .toMatchInlineSnapshot('"<pre class=\\"shiki min-dark\\" style=\\"background-color: #1f1f1f\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #B392F0\\">&lt;</span><span style=\\"color: #FFAB70\\">div</span><span style=\\"color: #B392F0\\"> class</span><span style=\\"color: #F97583\\">=</span><span style=\\"color: #FFAB70\\">&quot;foo&quot;</span><span style=\\"color: #B392F0\\">&gt;bar&lt;/</span><span style=\\"color: #FFAB70\\">div</span><span style=\\"color: #B392F0\\">&gt;</span></span></code></pre>"')
  })
})
