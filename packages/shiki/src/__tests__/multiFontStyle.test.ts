import { getHighlighter } from '../index'

test('Handle multiple font styles', async () => {
  const highlighter = await getHighlighter({
    theme: 'material-default',
    langs: ['md']
  })
  const out = highlighter.codeToHtml(`***bold italic***`, 'md')
  expect(out).toMatchSnapshot()
})
