import { getHighlighter } from '../index'

test('Nord highlighter highlights simple JavaScript using deprecated codeToHtml(code, lang?, theme?) overload', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })
  const out = highlighter.codeToHtml(`console.log('shiki');`, 'js')
  expect(out).toMatchSnapshot()
})
