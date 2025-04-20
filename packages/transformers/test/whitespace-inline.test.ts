import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'
import { transformerRenderWhitespace } from '../src/transformers/render-whitespace'

it('transformerRenderWhitespace', async () => {
  using shiki = await createHighlighter({
    themes: ['vitesse-dark', 'vitesse-light', 'nord'],
    langs: ['typescript'],
  })

  const transformer = transformerRenderWhitespace()

  const code = `
    const a = Math.random() > 0.5 ? 1 : \`foo\`
  `.trim()

  const result = shiki.codeToHtml(code, {
    lang: 'typescript',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
      nord: 'nord',
    },
    defaultColor: false,
    transformers: [transformer],
    structure: 'inline',
  })

  expect(result.replace(/<span/g, '\n<span'))
    .toMatchInlineSnapshot(`
      "
      <span style="--shiki-dark:#CB7676;--shiki-light:#AB5959;--shiki-nord:#81A1C1">const</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#BD976A;--shiki-light:#B07D48;--shiki-nord:#D8DEE9">a</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#666666;--shiki-light:#999999;--shiki-nord:#81A1C1">=</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#BD976A;--shiki-light:#B07D48;--shiki-nord:#D8DEE9">Math</span>
      <span style="--shiki-dark:#666666;--shiki-light:#999999;--shiki-nord:#ECEFF4">.</span>
      <span style="--shiki-dark:#80A665;--shiki-light:#59873A;--shiki-nord:#88C0D0">random</span>
      <span style="--shiki-dark:#666666;--shiki-light:#999999;--shiki-nord:#D8DEE9FF">()</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#666666;--shiki-light:#999999;--shiki-nord:#81A1C1">></span>
      <span class="space"> </span>
      <span style="--shiki-dark:#4C9A91;--shiki-light:#2F798A;--shiki-nord:#B48EAD">0.5</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#CB7676;--shiki-light:#AB5959;--shiki-nord:#81A1C1">?</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#4C9A91;--shiki-light:#2F798A;--shiki-nord:#B48EAD">1</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#CB7676;--shiki-light:#AB5959;--shiki-nord:#81A1C1">:</span>
      <span class="space"> </span>
      <span style="--shiki-dark:#C98A7D77;--shiki-light:#B5695977;--shiki-nord:#ECEFF4">\`</span>
      <span style="--shiki-dark:#C98A7D;--shiki-light:#B56959;--shiki-nord:#A3BE8C">foo</span>
      <span style="--shiki-dark:#C98A7D77;--shiki-light:#B5695977;--shiki-nord:#ECEFF4">\`</span>"
    `)
})
