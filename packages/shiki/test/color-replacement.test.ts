import { expect, it } from 'vitest'
import { codeToHtml } from '../src'

it('colorReplacements', async () => {
  const result = await codeToHtml('console.log("hi")', {
    lang: 'js',
    themes: {
      light: 'vitesse-light',
      dark: 'material-theme-palenight',
    },
    colorReplacements: {
      '#393a34': 'var(---replaced-1)',
      '#b07d48': 'var(---replaced-2)',
    },
  })

  expect(result).toContain('var(---replaced-1)')
  expect(result).toContain('var(---replaced-2)')

  expect(result.replace(/>/g, '>\n'))
    .toMatchInlineSnapshot(`
      "<pre class="shiki shiki-themes vitesse-light material-theme-palenight" style="background-color:#ffffff;--shiki-dark-bg:#292D3E;color:var(---replaced-1);--shiki-dark:#babed8" tabindex="0">
      <code>
      <span class="line">
      <span style="color:var(---replaced-2);--shiki-dark:#BABED8">
      console</span>
      <span style="color:#999999;--shiki-dark:#89DDFF">
      .</span>
      <span style="color:#59873A;--shiki-dark:#82AAFF">
      log</span>
      <span style="color:#999999;--shiki-dark:#BABED8">
      (</span>
      <span style="color:#B5695999;--shiki-dark:#89DDFF">
      "</span>
      <span style="color:#B56959;--shiki-dark:#C3E88D">
      hi</span>
      <span style="color:#B5695999;--shiki-dark:#89DDFF">
      "</span>
      <span style="color:#999999;--shiki-dark:#BABED8">
      )</span>
      </span>
      </code>
      </pre>
      "
    `)
})
