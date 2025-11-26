import { expect, it } from 'vitest'

it('bundle-full', async () => {
  const highlighter = await import('shiki/bundle/full').then(r => r.createHighlighter({
    langs: Object.keys(r.bundledLanguages),
    themes: [],
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`331`)
})

it('bundle-web', async () => {
  const highlighter = await import('shiki/bundle/web').then(r => r.createHighlighter({
    langs: Object.keys(r.bundledLanguages),
    themes: [],
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`95`)
})

it('bundle-react-native', async () => {
  const highlighter = await import('shiki/bundle/react-native').then(r => r.createHighlighter({
    langs: Object.keys(r.bundledLanguages),
    themes: ['nord'],
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`95`)

  // Test that it actually works
  const html = highlighter.codeToHtml('console.log("Hello")', {
    lang: 'javascript',
    theme: 'nord',
  })

  expect(html).toContain('console')
  expect(html).toContain('log')
})
