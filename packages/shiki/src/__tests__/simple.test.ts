import { getHighlighter } from '../index'

test('Nord highlighter highlights simple JavaScript', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })
  const out = highlighter.codeToHtml(`console.log('shiki');`, 'js')
  expect(out).toMatchSnapshot()
})

test('Highlighter can load languages', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  await highlighter.loadLanguage('vue')
  await highlighter.loadLanguage('css')
  await highlighter.loadLanguage('yaml')
  await highlighter.loadLanguage('php')

  expect(highlighter.getLoadedLanguages()).toEqual(
    expect.arrayContaining(['javascript', 'js', 'vue', 'css', 'yaml', 'php'])
  )
})
