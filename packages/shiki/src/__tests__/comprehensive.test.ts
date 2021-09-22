import { themes } from '../themes'
import { getHighlighter } from '../index'
import { languages } from '../languages'

describe('validates all themes run some JS', () => {
  const highlighter = getHighlighter({ langs: ['js'] })

  themes.forEach(theme => {
    it(theme, async () => {
      const hl = await highlighter
      await hl.loadTheme(theme)
      hl.codeToHtml(`console.log('shiki');`, 'js')
    })
  })
})

describe('validates all languages can show a hello-world', () => {
  const highlighter = getHighlighter({ theme: 'nord' })

  languages.forEach(language => {
    it(language.id, async () => {
      const hl = await highlighter
      hl.codeToHtml(`console.log('shiki');`, language.id)
    })
  })
})
