import { getHighlighter } from '../index'

test('The theme with css-variables renders correctly', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables',
    langs: ['js']
  })

  const kindOfAQuine = `
import { getHighlighter } from '../index'

test('The theme with css-variables renders correctly', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables'
  })
  const out = highlighter.codeToHtml("console.log('shiki');", 'js')
  expect(out).toMatchSnapshot()
})
`

  const out = highlighter.codeToHtml(kindOfAQuine, 'js')
  expect(out).toMatchSnapshot()
})
