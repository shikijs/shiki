import { getHighlighter } from '../index'

test('wrapperClasses parameter adds classes', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })

  const out = highlighter.codeToHtml(`console.log('test');`, 'js', 'nord', ['foo', 'bar'])
  expect(out).toMatchSnapshot()
  expect(out).not.toContain('shiki')
})

test('empty wrapperClasses omits <pre> class attribute', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const out = highlighter.codeToHtml(`console.log('test');`, 'js', 'nord', [])
  expect(out).toMatchSnapshot()
  expect(out).not.toContain('<pre class=')
})
