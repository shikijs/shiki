import { getHighlighter } from '../index'

test('Nord highlighter highlights simple JavaScript', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })
  const out = highlighter.codeToHtml(`console.log('shiki');`, { lang: 'js' })
  expect(out).toMatchSnapshot()
})
