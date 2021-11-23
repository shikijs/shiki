import { readFileSync } from 'fs'
import { getHighlighter } from '../../index'
import { resolve } from 'path'

function currentDirPath(p) {
  return resolve(__dirname, p)
}

test('Highlights custom language - Rockstar', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: [
      {
        id: 'rockstar',
        scopeName: 'source.rockstar',
        path: currentDirPath('./rockstar.tmLanguage.json'),
        aliases: []
      }
    ]
  })

  const code = readFileSync(currentDirPath('rockstar.rock'), 'utf-8')
  const out = highlighter.codeToHtml(code, { lang: 'rockstar' })
  expect(out).toMatchSnapshot()
})

test('Multiple custom language registrations should use last one', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: [
      {
        id: 'rockstar',
        scopeName: 'source.rockstar',
        path: currentDirPath('./rockstar.tmLanguage.json'),
        aliases: []
      },
      {
        id: 'rockstar',
        scopeName: 'source.rockstar',
        path: currentDirPath('./rockstar-override.tmLanguage.json'),
        aliases: []
      }
    ]
  })

  const code = readFileSync(currentDirPath('rockstar.rock'), 'utf-8')
  const out = highlighter.codeToHtml(code, { lang: 'rockstar' })
  expect(out).toMatchSnapshot()
})

test('Custom language registration can override builtin language', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: [
      {
        id: 'html',
        scopeName: 'text.html.basic',
        path: currentDirPath('./rockstar-html.tmLanguage.json'),
        aliases: []
      }
    ]
  })

  const code = readFileSync(currentDirPath('rockstar.rock'), 'utf-8')
  const out = highlighter.codeToHtml(code, { lang: 'html' })
  expect(out).toMatchSnapshot('rockstar')
})
