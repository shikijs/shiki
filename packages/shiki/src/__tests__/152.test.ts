// https://github.com/shikijs/shiki/issues/152
import { getHighlighter } from '../index'

test('Correctly highlights LaTeX', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['tex', 'latex']
  })

  const out = highlighter.codeToThemedTokens(`%\\usepackage{pkg}`, 'latex', 'nord', {
    includeExplanation: true
  })
  expect(out).toMatchSnapshot()
})
