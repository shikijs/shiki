import { bench, describe } from 'vitest'
import { ALL_FIXTURES, createBenchHighlighter, FIXTURE_LANG, loadAllFixtures } from '../_shared/setup'

const highlighter = await createBenchHighlighter(
  ['typescript', 'tsx', 'css', 'json', 'markdown'],
  ['vitesse-dark', 'vitesse-light', 'nord', 'github-dark', 'github-light'],
)
const fixtures = await loadAllFixtures()

describe('codeToHtml — themes (light+dark)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToHtml(code, {
        lang,
        themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      })
    })
  }
})

describe('codeToHtml — themes (5 themes)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToHtml(code, {
        lang,
        themes: {
          'light': 'vitesse-light',
          'dark': 'vitesse-dark',
          'nord': 'nord',
          'github-dark': 'github-dark',
          'github-light': 'github-light',
        },
      })
    })
  }
})

describe('codeToHtml — themes (light-dark())', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToHtml(code, {
        lang,
        themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
        defaultColor: 'light-dark()',
      })
    })
  }
})

describe('codeToTokensWithThemes', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToTokensWithThemes(code, {
        lang,
        themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      })
    })
  }
})
