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

  await highlighter.loadLanguage('php')
  await highlighter.loadLanguage('css')

  expect(highlighter.getLoadedLanguages()).toEqual(['javascript', 'js', 'php', 'css'])
})
