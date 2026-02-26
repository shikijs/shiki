import { createJavaScriptRegexEngine } from 'shiki'
import { describe, expect, it } from 'vitest'
import { codeToHtml, codeToTokens, codeToTokensBase, createShikiPrimitiveAsync } from '../src'

it('includeExplanation', async () => {
  using engine = await createShikiPrimitiveAsync({
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
    using engine = await createShikiPrimitiveAsync({
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

  it('with font style', async () => {
    using engine = await createShikiPrimitiveAsync({
      themes: [
        import('@shikijs/themes/dracula'),
        import('@shikijs/themes/dracula-soft'),
      ],
      langs: [
        import('@shikijs/langs/markdown'),
      ],
      engine: createJavaScriptRegexEngine(),
    })

    const code = 'text *italic* **bold**'
    const caseCssVars = codeToTokens(engine, code, {
      lang: 'md',
      themes: { light: 'dracula', dark: 'dracula-soft' },
      defaultColor: false,
    })
    const caseLightDark = codeToTokens(engine, code, {
      lang: 'md',
      themes: { light: 'dracula', dark: 'dracula-soft' },
      defaultColor: 'light-dark()',
      colorsRendering: 'none',
    })

    expect(caseCssVars).toMatchSnapshot('css-vars')
    expect(caseLightDark).toMatchSnapshot('light-dark()')
  })

  it('defaultColor light-dark() with multiple themes', async () => {
    using engine = await createShikiPrimitiveAsync({
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
    using engine = await createShikiPrimitiveAsync({
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

it('colorsRendering none', async () => {
  using engine = await createShikiPrimitiveAsync({
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
  expect(
    codeToHtml(engine, code, {
      lang: 'js',
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: 'light-dark()',
      colorsRendering: 'none',
    }),
  ).toMatchSnapshot('colorsRendering none with defaultColor')

  expect(
    codeToHtml(engine, code, {
      lang: 'js',
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      colorsRendering: 'none',
      defaultColor: false,
    }),
  ).toMatchSnapshot('colorsRendering none')
})
