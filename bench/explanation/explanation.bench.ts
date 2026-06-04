import { bench, describe } from 'vitest'
import { ALL_FIXTURES, createBenchHighlighter, FIXTURE_LANG, loadAllFixtures } from '../_shared/setup'

const highlighter = await createBenchHighlighter()
const fixtures = await loadAllFixtures()

describe('codeToTokens — includeExplanation:false (control)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToTokens(code, {
        lang,
        theme: 'vitesse-dark',
        includeExplanation: false,
      })
    })
  }
})

describe('codeToTokens — includeExplanation:"scopeName"', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToTokens(code, {
        lang,
        theme: 'vitesse-dark',
        includeExplanation: 'scopeName',
      })
    })
  }
})

describe('codeToTokens — includeExplanation:true (full)', () => {
  for (const f of ALL_FIXTURES) {
    const code = fixtures[f]
    const lang = FIXTURE_LANG[f]
    bench(f, () => {
      highlighter.codeToTokens(code, {
        lang,
        theme: 'vitesse-dark',
        includeExplanation: true,
      })
    })
  }
})
