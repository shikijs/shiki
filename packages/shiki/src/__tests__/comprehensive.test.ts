import { themes } from '../themes'
import { getHighlighter } from '../index'
import { languages } from '../languages'

describe('validates all themes run some JS', () => {
  themes.forEach(theme => {
    it(theme, async () => {
      const highlighter = await getHighlighter({ theme })
      highlighter.codeToHtml(`console.log('shiki');`, 'js')
    })
  })
})

describe('validates all languages can show a hello-world', () => {
  languages.forEach(language => {
    it(language.id, async () => {
      const highlighter = await getHighlighter({ theme: 'nord' })
      highlighter.codeToHtml(`console.log('shiki');`, language.id)
    })
  })
})
