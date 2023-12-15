import { describe, expect, it } from 'vitest'
import { getHighlighterCore } from '../src/core'

import js from '../src/assets/langs/javascript'
import ts from '../src/assets/langs/typescript'
import nord from '../dist/themes/nord.mjs'
import mtp from '../dist/themes/material-theme-palenight.mjs'
import onig from '../../shikiji-core/dist/onig.mjs'

describe('should', () => {
  it('works', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [js as any],
      loadWasm: {
        instantiator: obj => WebAssembly.instantiate(onig, obj),
      },
    })

    expect(shiki.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'nord' }))
      .toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#D8DEE9">console</span><span style="color:#ECEFF4">.</span><span style="color:#88C0D0">log</span><span style="color:#D8DEE9FF">(</span><span style="color:#ECEFF4">"</span><span style="color:#A3BE8C">Hi</span><span style="color:#ECEFF4">"</span><span style="color:#D8DEE9FF">)</span></span></code></pre>"`)
  })

  it('dynamic load theme and lang', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [
        js,
        import('../src/assets/langs/c'),
      ],
      loadWasm: {
        instantiator: obj => WebAssembly.instantiate(onig, obj),
      },
    })

    await shiki.loadLanguage(() => import('../src/assets/langs/python'))
    await shiki.loadTheme(() => import('../dist/themes/vitesse-light.mjs').then(m => m.default))

    expect(shiki.getLoadedLanguages())
      .toMatchInlineSnapshot(`
        [
          "javascript",
          "c",
          "python",
          "js",
          "py",
        ]
      `)
    expect(shiki.getLoadedThemes())
      .toMatchInlineSnapshot(`
        [
          "nord",
          "vitesse-light",
        ]
      `)

    expect(shiki.codeToHtml('print 1', { lang: 'python', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#998418">print</span><span style="color:#2F798A"> 1</span></span></code></pre>"`)
  })

  it('requires nested lang', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [
        import('../src/assets/langs/cpp'),
      ],
    })

    expect(shiki.getLoadedLanguages())
      .toMatchInlineSnapshot(`
        [
          "sql",
          "c",
          "glsl",
          "cpp",
          "c++",
        ]
      `)
  })

  it('works without no initial langs and themes', async () => {
    const shiki = await getHighlighterCore()

    await shiki.loadLanguage(js)
    await shiki.loadTheme(nord)

    const code = shiki.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'nord' })

    expect(code).toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#D8DEE9">console</span><span style="color:#ECEFF4">.</span><span style="color:#88C0D0">log</span><span style="color:#D8DEE9FF">(</span><span style="color:#ECEFF4">"</span><span style="color:#A3BE8C">Hi</span><span style="color:#ECEFF4">"</span><span style="color:#D8DEE9FF">)</span></span></code></pre>"`)
  })

  it('works with alias', async () => {
    const shiki = await getHighlighterCore({
      langAlias: {
        mylang: 'javascript',
        mylang2: 'js', // nested alias
      },
    })

    await shiki.loadLanguage(js)
    await shiki.loadTheme(nord)

    const code = shiki.codeToHtml('console.log("Hi")', { lang: 'mylang', theme: 'nord' })
    const code2 = shiki.codeToHtml('console.log("Hi")', { lang: 'mylang2', theme: 'nord' })
    expect(code).toBe(code2)
    expect(code).toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#D8DEE9">console</span><span style="color:#ECEFF4">.</span><span style="color:#88C0D0">log</span><span style="color:#D8DEE9FF">(</span><span style="color:#ECEFF4">"</span><span style="color:#A3BE8C">Hi</span><span style="color:#ECEFF4">"</span><span style="color:#D8DEE9FF">)</span></span></code></pre>"`)
  })

  it('works with alias override', async () => {
    const shiki = await getHighlighterCore({
      langAlias: {
        js: 'typescript',
      },
    })

    await shiki.loadLanguage(ts)
    await shiki.loadTheme(nord)

    const code = shiki.codeToHtml('const a: Foo = 1', { lang: 'js', theme: 'nord' })
    expect(code).toMatchInlineSnapshot(`"<pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#81A1C1">const</span><span style="color:#D8DEE9"> a</span><span style="color:#81A1C1">:</span><span style="color:#8FBCBB"> Foo</span><span style="color:#81A1C1"> =</span><span style="color:#B48EAD"> 1</span></span></code></pre>"`)
  })
})

describe('errors', () => {
  it('throw on invalid theme', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [js as any],
    })

    await expect(() => shiki.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'invalid' }))
      .toThrowErrorMatchingInlineSnapshot(`[Error: [shikiji] Theme \`invalid\` not found, you may need to load it first]`)
  })

  it('throw on invalid lang', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [js as any],
    })

    await expect(() => shiki.codeToHtml('console.log("Hi")', { lang: 'abc', theme: 'nord' }))
      .toThrowErrorMatchingInlineSnapshot(`[Error: [shikiji] Language \`abc\` not found, you may need to load it first]`)
  })

  it('highlight with raw theme registation', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [js as any],
      loadWasm: {
        instantiator: obj => WebAssembly.instantiate(onig, obj),
      },
    })

    const code = shiki.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: mtp })
    expect.soft(code)
      .toMatchInlineSnapshot(`"<pre class="shiki material-theme-palenight" style="background-color:#292D3E;color:#babed8" tabindex="0"><code><span class="line"><span style="color:#BABED8">console</span><span style="color:#89DDFF">.</span><span style="color:#82AAFF">log</span><span style="color:#BABED8">(</span><span style="color:#89DDFF">"</span><span style="color:#C3E88D">Hi</span><span style="color:#89DDFF">"</span><span style="color:#BABED8">)</span></span></code></pre>"`)

    expect.soft(shiki.getLoadedThemes()).toContain('material-theme-palenight')

    const code2 = shiki.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'material-theme-palenight' })
    expect.soft(code2).toBe(code)
  })

  it('throw on circular alias', async () => {
    const shiki = await getHighlighterCore({
      langAlias: {
        mylang: 'mylang2',
        mylang2: 'mylang',
      },
    })

    await shiki.loadLanguage(js)
    await shiki.loadTheme(nord)

    await expect(() => shiki.codeToHtml('console.log("Hi")', { lang: 'mylang', theme: 'nord' }))
      .toThrowErrorMatchingInlineSnapshot(`[Error: [shikiji] Circular alias \`mylang -> mylang2 -> mylang\`]`)
  })
})
