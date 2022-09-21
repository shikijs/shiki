import path from 'path'
import { getHighlighter, loadTheme } from '../index'

test('No font-style is applied if none is specified', async () => {
  const fNone = await loadTheme(path.resolve(__dirname, './custom-fonts/font-none.json'))
  const highlighter = await getHighlighter({
    theme: fNone,
    langs: ['js']
  })
  const out = highlighter.codeToHtml(`function() {return 1}`, { lang: 'js' })

  expect(out).not.toContain('font-style:')
})

test('An italic font-style is applied if specified', async () => {
  const fItalic = await loadTheme(path.resolve(__dirname, './custom-fonts/font-italic.json'))
  const highlighter = await getHighlighter({
    theme: fItalic,
    langs: ['js']
  })
  const out = highlighter.codeToHtml(`function() {return 1}`, { lang: 'js' })

  expect(out).toContain('font-style: italic')
})

test('A bold font-style is applied if specified', async () => {
  const fBold = await loadTheme(path.resolve(__dirname, './custom-fonts/font-bold.json'))
  const highlighter = await getHighlighter({
    theme: fBold,
    langs: ['js']
  })
  // console.log(JSON.stringify(highlighter.codeToThemedTokens(`function() {return 1}`, 'js'), null, 2))
  const out = highlighter.codeToHtml(`function() {return 1}`, { lang: 'js' })

  expect(out).toContain('font-weight: bold')
})

test('A bold fontStyle should not apply an italic font-style', async () => {
  const fBold = await loadTheme(path.resolve(__dirname, './custom-fonts/font-bold.json'))
  const highlighter = await getHighlighter({
    theme: fBold,
    langs: ['js']
  })
  const out = highlighter.codeToHtml(`function() {return 1}`, { lang: 'js' })

  expect(out).not.toContain('font-style: italic')
})
