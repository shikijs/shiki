import { expect, it } from 'vitest'

it('bundle-full', async () => {
  const highlighter = await import('shikiji/bundle/full').then(r => r.getHighlighter({
    langs: Object.keys(r.bundledLanguages),
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`240`)
})

it('bundle-web', async () => {
  const highlighter = await import('shikiji/bundle/web').then(r => r.getHighlighter({
    langs: Object.keys(r.bundledLanguages),
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`79`)
})
