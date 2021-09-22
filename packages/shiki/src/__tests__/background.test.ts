import { getHighlighter } from '../index'

test(`Token with no color shouldn't generate color: undefined`, async () => {
  const highlighter = await getHighlighter({
    theme: 'monokai',
    langs: ['js']
  })
  const out = highlighter.codeToHtml(`whatever`, 'txt')
  expect(out).not.toContain('undefined')
})
