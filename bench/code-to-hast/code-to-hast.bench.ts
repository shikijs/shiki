import { bench, describe } from 'vitest'
import { ALL_FIXTURES, createBenchHighlighter, FIXTURE_LANG, loadAllFixtures } from '../_shared/setup'

const highlighter = await createBenchHighlighter()
const fixtures = await loadAllFixtures()

describe('codeToHtml (single theme)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' })
    })
  }
})

describe('codeToHast (single theme)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToHast(code, { lang, theme: 'vitesse-dark' })
    })
  }
})

describe('codeToTokens (single theme)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToTokens(code, { lang, theme: 'vitesse-dark' })
    })
  }
})

describe('codeToTokensBase (engine only)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToTokensBase(code, { lang, theme: 'vitesse-dark' })
    })
  }
})

describe('codeToHtml with mergeSameStyleTokens', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark', mergeSameStyleTokens: true })
    })
  }
})
