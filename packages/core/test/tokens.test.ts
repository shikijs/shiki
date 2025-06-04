import { createJavaScriptRegexEngine } from 'shiki'
import { describe, expect, it } from 'vitest'
import { codeToTokens, codeToTokensBase, createShikiInternal } from '../src'

it('includeExplanation', async () => {
  using engine = await createShikiInternal({
    themes: [
      import('@shikijs/themes/vitesse-dark'),
    ],
    langs: [
      import('@shikijs/langs/javascript'),
    ],
    engine: createJavaScriptRegexEngine(),
  })

  const code = 'console.log("hello")'
  const caseFalse = await codeToTokensBase(engine, code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: false })
  const caseTrue = await codeToTokensBase(engine, code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: true })
  const caseScopeName = await codeToTokensBase(engine, code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: 'scopeName' })

  expect(caseFalse).toMatchSnapshot('false')
  expect(caseTrue).toMatchSnapshot('true')
  expect(caseScopeName).toMatchSnapshot('scopeName')
})

describe('defaultColor light-dark()', () => {
  it('basic', async () => {
    using engine = await createShikiInternal({
      themes: [
        import('@shikijs/themes/vitesse-light'),
        import('@shikijs/themes/vitesse-dark'),
      ],
      langs: [
        import('@shikijs/langs/javascript'),
      ],
      engine: createJavaScriptRegexEngine(),
    })

    const code = 'console.log("hello")'
    const caseCssVars = codeToTokens(engine, code, {
      lang: 'js',
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: false,
    })
    const caseLightDark = codeToTokens(engine, code, {
      lang: 'js',
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: 'light-dark()',
    })

    expect(caseCssVars).toMatchSnapshot('css-vars')
    expect(caseLightDark).toMatchSnapshot('light-dark()')
  })

  it('defaultColor light-dark() with multiple themes', async () => {
    using engine = await createShikiInternal({
      themes: [
        import('@shikijs/themes/vitesse-light'),
        import('@shikijs/themes/vitesse-dark'),
        import('@shikijs/themes/github-dark'),
      ],
      langs: [
        import('@shikijs/langs/javascript'),
      ],
      engine: createJavaScriptRegexEngine(),
    })

    const code = 'console.log("hello")'
    const caseCssVars = codeToTokens(engine, code, {
      lang: 'js',
      themes: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
        custom: 'github-dark',
      },
      defaultColor: false,
    })
    const caseLightDark = codeToTokens(engine, code, {
      lang: 'js',
      themes: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
        custom: 'github-dark',
      },
      defaultColor: 'light-dark()',
    })

    expect(caseCssVars).toMatchSnapshot('css-vars')
    expect(caseLightDark).toMatchSnapshot('light-dark()')
  })

  it('should throw when no light or dark theme is provided', async () => {
    using engine = await createShikiInternal({
      themes: [
        import('@shikijs/themes/vitesse-light'),
        import('@shikijs/themes/vitesse-dark'),
        import('@shikijs/themes/github-dark'),
      ],
      langs: [
        import('@shikijs/langs/javascript'),
      ],
      engine: createJavaScriptRegexEngine(),
    })

    const code = 'console.log("hello")'

    expect(() => {
      codeToTokens(engine, code, {
        lang: 'js',
        themes: {
          dark2: 'vitesse-dark',
          light1: 'vitesse-light',
        },
        defaultColor: 'light-dark()',
      })
    })
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: When using \`defaultColor: "light-dark()"\`, you must provide both \`light\` and \`dark\` themes]`)

    expect(() => {
      codeToTokens(engine, code, {
        lang: 'js',
        themes: {
          dark: 'vitesse-dark',
          light1: 'vitesse-light',
        },
        defaultColor: 'light-dark()',
      })
    })
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: When using \`defaultColor: "light-dark()"\`, you must provide both \`light\` and \`dark\` themes]`)

    // not throw when only one theme is provided
    codeToTokens(engine, code, {
      lang: 'js',
      theme: 'vitesse-dark',
      defaultColor: 'light-dark()',
    })
  })
})
