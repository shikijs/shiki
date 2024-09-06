import { getSingletonHighlighter } from 'shiki'
import { expect, it } from 'vitest'
// eslint-disable-next-line antfu/no-import-dist
import { wasmBinary } from '../../core/dist/wasm-inlined.mjs'

import js from '../src/assets/langs/javascript'
import mtp from '../src/assets/themes/material-theme-palenight'
import nord from '../src/assets/themes/nord'

import { getSingletonHighlighterCore } from '../src/core'

it('getSingletonHighlighterCore', async () => {
  const shiki1 = await getSingletonHighlighterCore({
    themes: [nord],
    langs: [js as any],
    loadWasm: {
      instantiator: obj => WebAssembly.instantiate(wasmBinary, obj),
    },
  })

  expect(shiki1.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'nord' }))
    .toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#D8DEE9">console</span><span style="color:#ECEFF4">.</span><span style="color:#88C0D0">log</span><span style="color:#D8DEE9FF">(</span><span style="color:#ECEFF4">"</span><span style="color:#A3BE8C">Hi</span><span style="color:#ECEFF4">"</span><span style="color:#D8DEE9FF">)</span></span></code></pre>"`)

  const shiki2 = await getSingletonHighlighterCore({
    themes: [mtp],
  })

  expect(shiki1).toBe(shiki2)

  expect(shiki2.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'material-theme-palenight' }))
    .toMatchInlineSnapshot(`"<pre class="shiki material-theme-palenight" style="background-color:#292D3E;color:#babed8" tabindex="0"><code><span class="line"><span style="color:#BABED8">console</span><span style="color:#89DDFF">.</span><span style="color:#82AAFF">log</span><span style="color:#BABED8">(</span><span style="color:#89DDFF">"</span><span style="color:#C3E88D">Hi</span><span style="color:#89DDFF">"</span><span style="color:#BABED8">)</span></span></code></pre>"`)
})

it('getSingletonHighlighter', async () => {
  const shiki1 = await getSingletonHighlighter({
    themes: ['nord'],
    langs: ['javascript'],
  })

  expect(shiki1.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'nord' }))
    .toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#D8DEE9">console</span><span style="color:#ECEFF4">.</span><span style="color:#88C0D0">log</span><span style="color:#D8DEE9FF">(</span><span style="color:#ECEFF4">"</span><span style="color:#A3BE8C">Hi</span><span style="color:#ECEFF4">"</span><span style="color:#D8DEE9FF">)</span></span></code></pre>"`)

  const shiki2 = await getSingletonHighlighter({
    themes: ['material-theme-palenight'],
  })

  expect(shiki1).toBe(shiki2)

  expect(shiki2.getLoadedThemes())
    .toMatchInlineSnapshot(`
      [
        "nord",
        "material-theme-palenight",
      ]
    `)

  expect(shiki2.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'material-theme-palenight' }))
    .toMatchInlineSnapshot(`"<pre class="shiki material-theme-palenight" style="background-color:#292D3E;color:#babed8" tabindex="0"><code><span class="line"><span style="color:#BABED8">console</span><span style="color:#89DDFF">.</span><span style="color:#82AAFF">log</span><span style="color:#BABED8">(</span><span style="color:#89DDFF">"</span><span style="color:#C3E88D">Hi</span><span style="color:#89DDFF">"</span><span style="color:#BABED8">)</span></span></code></pre>"`)
})
