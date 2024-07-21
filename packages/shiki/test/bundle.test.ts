import { expect, it } from 'vitest'

it('bundle-full', async () => {
  const highlighter = await import('shiki/bundle/full').then(r => r.createHighlighter({
    langs: Object.keys(r.bundledLanguages),
    themes: [],
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`299`)
})

it('bundle-web', async () => {
  const highlighter = await import('shiki/bundle/web').then(r => r.createHighlighter({
    langs: Object.keys(r.bundledLanguages),
    themes: [],
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`84`)
})
