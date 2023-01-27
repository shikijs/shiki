import { getHighlighter } from '../index'

test('Handle multiple font styles', async () => {
  const highlighter = await getHighlighter({
    theme: 'material-theme',
    langs: ['md']
  })
  const out = highlighter.codeToHtml(`***bold italic***`, { lang: 'md' })
  expect(out).toMatchSnapshot()
})
