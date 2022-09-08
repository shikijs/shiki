import { getHighlighter } from '../index'

// https://github.com/shikijs/shiki/issues/152
test('Correctly highlights LaTeX (#152)', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['tex', 'latex']
  })

  const out = highlighter.codeToThemedTokens(`%\\usepackage{pkg}`, 'latex', 'nord', {
    includeExplanation: true
  })
  expect(out).toMatchSnapshot()
})

// https://github.com/shikijs/shiki/issues/264
test('Correctly handles variable length lookbehind (#264)', async () => {
  const highlighter = await getHighlighter({
    theme: 'light-plus',
    langs: ['svelte']
  })

  const out = highlighter.codeToThemedTokens(`<div let:x={a} />`, 'svelte', 'light-plus', {
    includeExplanation: true
  })
  expect(out).toMatchSnapshot()
})

// https://github.com/shikijs/shiki/issues/326
test(`Don't preload any language if lang is set to an empty array (#326)`, async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: []
  })
  expect(highlighter.getLoadedLanguages()).toHaveLength(0)
})
