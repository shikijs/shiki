import { describe, expect, it } from 'vitest'
import { createHighlighter } from '../src'

it('getLastGrammarState', async () => {
  const shiki = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['typescript'],
  })

  const state = shiki.getLastGrammarState('let a:', { lang: 'typescript', theme: 'vitesse-light' })

  expect.soft(state).toMatchInlineSnapshot(`
    {
      "lang": "typescript",
      "scopes": [
        "meta.type.annotation.ts",
        "meta.var-single-variable.expr.ts",
        "meta.var.expr.ts",
        "source.ts",
      ],
      "theme": "vitesse-light",
    }
  `)

  const input = 'Omit<{}, string | number>'

  const highlightedNatural = shiki.codeToTokens(input, {
    lang: 'typescript',
    theme: 'vitesse-light',
  })

  const highlightedContext = shiki.codeToTokens(input, {
    lang: 'typescript',
    theme: 'vitesse-light',
    grammarState: state,
  })

  const highlightedContext2 = shiki.codeToTokens(input, {
    lang: 'typescript',
    theme: 'vitesse-light',
    grammarState: state,
  })

  expect
    .soft(highlightedNatural)
    .not
    .toEqual(highlightedContext)

  expect
    .soft(highlightedContext)
    .toEqual(highlightedContext2)

  expect
    .soft(highlightedNatural)
    .toMatchInlineSnapshot(`
      {
        "bg": "#ffffff",
        "fg": "#393a34",
        "rootStyle": undefined,
        "themeName": "vitesse-light",
        "tokens": [
          [
            {
              "color": "#B07D48",
              "content": "Omit",
              "fontStyle": 0,
              "offset": 0,
            },
            {
              "color": "#999999",
              "content": "<{},",
              "fontStyle": 0,
              "offset": 4,
            },
            {
              "color": "#393A34",
              "content": " ",
              "fontStyle": 0,
              "offset": 8,
            },
            {
              "color": "#B07D48",
              "content": "string",
              "fontStyle": 0,
              "offset": 9,
            },
            {
              "color": "#393A34",
              "content": " ",
              "fontStyle": 0,
              "offset": 15,
            },
            {
              "color": "#AB5959",
              "content": "|",
              "fontStyle": 0,
              "offset": 16,
            },
            {
              "color": "#393A34",
              "content": " ",
              "fontStyle": 0,
              "offset": 17,
            },
            {
              "color": "#B07D48",
              "content": "number",
              "fontStyle": 0,
              "offset": 18,
            },
            {
              "color": "#999999",
              "content": ">",
              "fontStyle": 0,
              "offset": 24,
            },
          ],
        ],
      }
    `)

  expect.soft(highlightedContext).toMatchInlineSnapshot(`
      {
        "bg": "#ffffff",
        "fg": "#393a34",
        "rootStyle": undefined,
        "themeName": "vitesse-light",
        "tokens": [
          [
            {
              "color": "#2E8F82",
              "content": "Omit",
              "fontStyle": 0,
              "offset": 0,
            },
            {
              "color": "#999999",
              "content": "<{}, ",
              "fontStyle": 0,
              "offset": 4,
            },
            {
              "color": "#2E8F82",
              "content": "string",
              "fontStyle": 0,
              "offset": 9,
            },
            {
              "color": "#999999",
              "content": " | ",
              "fontStyle": 0,
              "offset": 15,
            },
            {
              "color": "#2E8F82",
              "content": "number",
              "fontStyle": 0,
              "offset": 18,
            },
            {
              "color": "#999999",
              "content": ">",
              "fontStyle": 0,
              "offset": 24,
            },
          ],
        ],
      }
    `)
})

it('grammarContextCode', async () => {
  const shiki = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['typescript', 'vue', 'html'],
  })

  const input = '<div :value="1 + 2"><button /></div>'

  const highlightedHtml = shiki.codeToHtml(input, {
    lang: 'html',
    theme: 'vitesse-light',
    structure: 'inline',
  })

  const highlightedVueTemplate = shiki.codeToHtml(input, {
    lang: 'vue',
    theme: 'vitesse-light',
    structure: 'inline',
    grammarContextCode: '<template>',
  })

  const highlightedVueBare = shiki.codeToHtml(input, {
    lang: 'vue',
    theme: 'vitesse-light',
    structure: 'inline',
  })

  expect(highlightedHtml)
    .toMatchInlineSnapshot(`"<span style="color:#999999">&#x3C;</span><span style="color:#1E754F">div</span><span style="color:#B07D48"> :value</span><span style="color:#999999">=</span><span style="color:#B5695977">"</span><span style="color:#B56959">1 + 2</span><span style="color:#B5695977">"</span><span style="color:#999999">>&#x3C;</span><span style="color:#1E754F">button</span><span style="color:#999999;font-style:italic"> /</span><span style="color:#999999">>&#x3C;/</span><span style="color:#1E754F">div</span><span style="color:#999999">></span>"`)

  expect(highlightedVueTemplate)
    .toMatchInlineSnapshot(`"<span style="color:#999999">&#x3C;</span><span style="color:#1E754F">div</span><span style="color:#999999"> :</span><span style="color:#59873A">value</span><span style="color:#999999">=</span><span style="color:#999999">"</span><span style="color:#2F798A">1</span><span style="color:#AB5959"> +</span><span style="color:#2F798A"> 2</span><span style="color:#999999">"</span><span style="color:#999999">>&#x3C;</span><span style="color:#1E754F">button</span><span style="color:#999999;font-style:italic"> /</span><span style="color:#999999">>&#x3C;/</span><span style="color:#1E754F">div</span><span style="color:#999999">></span>"`)

  expect(highlightedVueBare)
    .toMatchInlineSnapshot(`"<span style="color:#999999">&#x3C;</span><span style="color:#1E754F">div</span><span style="color:#999999"> :</span><span style="color:#59873A">value</span><span style="color:#999999">=</span><span style="color:#999999">"</span><span style="color:#2F798A">1</span><span style="color:#AB5959"> +</span><span style="color:#2F798A"> 2</span><span style="color:#999999">"</span><span style="color:#999999">></span><span style="color:#393A34">&#x3C;button /></span><span style="color:#999999">&#x3C;/</span><span style="color:#1E754F">div</span><span style="color:#999999">></span>"`)

  expect(highlightedVueTemplate)
    .not
    .toEqual(highlightedVueBare)
})

describe('errors', () => {
  it('should throw on wrong language', async () => {
    const shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['typescript', 'javascript'],
    })

    const state = shiki.getLastGrammarState('let a:', { lang: 'typescript', theme: 'vitesse-light' })

    expect(() => shiki.codeToTokens('string', {
      lang: 'js',
      theme: 'vitesse-light',
      grammarState: state,
    }))
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Grammar state language "typescript" does not match highlight language "javascript"]`)

    // Alias "ts" should not throw
    shiki.codeToTokens('string', {
      lang: 'ts',
      theme: 'vitesse-light',
      grammarState: state,
    })
  })

  it('should throw on wrong themes', async () => {
    const shiki = await createHighlighter({
      themes: ['vitesse-light', 'vitesse-dark'],
      langs: ['typescript', 'javascript'],
    })

    const state = shiki.getLastGrammarState('let a:', { lang: 'typescript', theme: 'vitesse-light' })

    expect(() => shiki.codeToTokens('string', {
      lang: 'ts',
      theme: 'vitesse-dark',
      grammarState: state,
    }))
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Grammar state theme "vitesse-light" does not match highlight theme "vitesse-dark"]`)
  })
})
