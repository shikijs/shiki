import { themes } from '../themes'
import { getHighlighter } from '../index'
import { languages } from '../languages'

describe('validates all themes run some JS', () => {
  const highlighter = getHighlighter({ langs: ['js'] })

  themes.forEach(theme => {
    it(theme, async () => {
      const hl = await highlighter
      await hl.loadTheme(theme)
      const result = hl.codeToHtml(`console.log('shiki');`, { lang: 'js', theme })
      expect(result).toContain(`class=\"shiki\"`)
    })
  })
})

describe('validates all themes run some JS with addThemeNameToClass enabled', () => {
  const highlighter = getHighlighter({ langs: ['js'] })

  themes.forEach(theme => {
    it(theme, async () => {
      const hl = await highlighter
      await hl.loadTheme(theme)
      const result = hl.codeToHtml(`console.log('shiki');`, {
        lang: 'js',
        theme,
        addThemeNameToClass: true
      })
      expect(result).toContain(`class=\"shiki ${theme}\"`)
    })
  })
})

describe('validates all languages can show a hello-world', () => {
  const highlighter = getHighlighter({ theme: 'nord' })

  languages.forEach(language => {
    it(language.id, async () => {
      const hl = await highlighter
      hl.codeToHtml(`console.log('shiki');`, { lang: language.id })
    })
  })
})
