import { getHighlighter } from '../index'

test('Requesting html as language also loads the embedded languages like JavaScript or CSS', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['html']
  })
  const languages = highlighter.getLoadedLanguages()
  expect(languages.sort()).toEqual(['html', 'css', 'javascript', 'js'].sort())
})
