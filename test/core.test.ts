import { describe, expect, it } from 'vitest'
import { getHighlighterCore } from '../src/core'

import js from '../src/assets/langs/javascript'
import nord from '../dist/themes/nord.mjs'

// @ts-expect-error no-types
import onig from '../dist/onig.mjs'

describe('should', () => {
  it('works', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [js as any],
      loadWasm: {
        instantiator: obj => WebAssembly.instantiate(onig, obj),
      },
    })

    expect(shiki.codeToHtml('console.log("Hi")', { lang: 'javascript' }))
      .toMatchInlineSnapshot('"<pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff; color: #2e3440ff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #ECEFF4\\">&quot;</span><span style=\\"color: #A3BE8C\\">Hi</span><span style=\\"color: #ECEFF4\\">&quot;</span><span style=\\"color: #D8DEE9FF\\">)</span></span></code></pre>"')
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
          "js",
          "c",
          "python",
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
      .toMatchInlineSnapshot('"<pre class=\\"shiki vitesse-light\\" style=\\"background-color: #ffffff; color: #ffffff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #998418\\">print</span><span style=\\"color: #393A34\\"> </span><span style=\\"color: #2F798A\\">1</span></span></code></pre>"')
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
        ]
      `)
  })
})

describe('errors', () => {
  it('throw on invalid theme', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [js as any],
    })

    await expect(() => shiki.codeToHtml('console.log("Hi")', { lang: 'javascript', theme: 'invalid' }))
      .toThrowErrorMatchingInlineSnapshot('"[shikiji] Theme `invalid` not found"')
  })

  it('throw on invalid lang', async () => {
    const shiki = await getHighlighterCore({
      themes: [nord],
      langs: [js as any],
    })

    await expect(() => shiki.codeToHtml('console.log("Hi")', { lang: 'abc', theme: 'nord' }))
      .toThrowErrorMatchingInlineSnapshot('"[shikiji] Language `abc` not found"')
  })
})
