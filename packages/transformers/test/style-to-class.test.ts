import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'
import { transformerStyleToClass } from '../src/transformers/style-to-class'

it('transformerStyleToClass', async () => {
  using shiki = await createHighlighter({
    themes: ['vitesse-dark', 'vitesse-light', 'nord'],
    langs: ['typescript'],
  })

  const transformer = transformerStyleToClass()

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
  })

  expect(result.replace(/<span/g, '\n<span'))
    .toMatchInlineSnapshot(`
      "<pre class="shiki shiki-themes vitesse-dark vitesse-light nord __shiki_uywmyh" tabindex="0"><code>
      <span class="line">
      <span class="__shiki_223nhr">const</span>
      <span class="__shiki_u5wfov"> a</span>
      <span class="__shiki_26darv"> =</span>
      <span class="__shiki_u5wfov"> Math</span>
      <span class="__shiki_17lqoe">.</span>
      <span class="__shiki_6u0ar0">random</span>
      <span class="__shiki_k92bfk">()</span>
      <span class="__shiki_26darv"> ></span>
      <span class="__shiki_1328cg"> 0.5</span>
      <span class="__shiki_223nhr"> ?</span>
      <span class="__shiki_1328cg"> 1</span>
      <span class="__shiki_223nhr"> :</span>
      <span class="__shiki_ga6n9x"> \`</span>
      <span class="__shiki_23isjw">foo</span>
      <span class="__shiki_ga6n9x">\`</span></span></code></pre>"
    `)

  expect(transformer.getCSS()).toMatchInlineSnapshot(`".__shiki_223nhr{--shiki-dark:#CB7676;--shiki-light:#AB5959;--shiki-nord:#81A1C1}.__shiki_u5wfov{--shiki-dark:#BD976A;--shiki-light:#B07D48;--shiki-nord:#D8DEE9}.__shiki_26darv{--shiki-dark:#666666;--shiki-light:#999999;--shiki-nord:#81A1C1}.__shiki_17lqoe{--shiki-dark:#666666;--shiki-light:#999999;--shiki-nord:#ECEFF4}.__shiki_6u0ar0{--shiki-dark:#80A665;--shiki-light:#59873A;--shiki-nord:#88C0D0}.__shiki_k92bfk{--shiki-dark:#666666;--shiki-light:#999999;--shiki-nord:#D8DEE9FF}.__shiki_1328cg{--shiki-dark:#4C9A91;--shiki-light:#2F798A;--shiki-nord:#B48EAD}.__shiki_ga6n9x{--shiki-dark:#C98A7D77;--shiki-light:#B5695977;--shiki-nord:#ECEFF4}.__shiki_23isjw{--shiki-dark:#C98A7D;--shiki-light:#B56959;--shiki-nord:#A3BE8C}.__shiki_uywmyh{--shiki-dark:#dbd7caee;--shiki-light:#393a34;--shiki-nord:#d8dee9ff;--shiki-dark-bg:#121212;--shiki-light-bg:#ffffff;--shiki-nord-bg:#2e3440ff}"`)
})
