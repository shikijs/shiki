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
  const out = highlighter.codeToHtml(code, 'rockstar')
  expect(out).toMatchSnapshot()
})
