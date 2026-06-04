import { bench, describe } from 'vitest'
import { amplify, createBenchHighlighter, loadFixture } from '../_shared/setup'

const highlighter = await createBenchHighlighter()
const ts = await loadFixture('ts')
const md = await loadFixture('md')

// Amplified fixtures simulate progressively larger files.
// Sizes approximate: ts ~2.2 KB → 22 KB / 110 KB / 220 KB; md ~3.7 KB → 37 KB / 185 KB.
const ts10 = amplify(ts, 10)
const ts50 = amplify(ts, 50)
const ts100 = amplify(ts, 100)
const md10 = amplify(md, 10)
const md50 = amplify(md, 50)

describe('codeToHtml — large TS (10x ~22 KB)', () => {
  bench('codeToHtml', () => {
    highlighter.codeToHtml(ts10, { lang: 'typescript', theme: 'vitesse-dark' })
  })
  bench('codeToHast', () => {
    highlighter.codeToHast(ts10, { lang: 'typescript', theme: 'vitesse-dark' })
  })
  bench('codeToTokens', () => {
    highlighter.codeToTokens(ts10, { lang: 'typescript', theme: 'vitesse-dark' })
  })
  bench('codeToTokensBase', () => {
    highlighter.codeToTokensBase(ts10, { lang: 'typescript', theme: 'vitesse-dark' })
  })
})

describe('codeToHtml — large TS (50x ~110 KB)', () => {
  bench('codeToHtml', () => {
    highlighter.codeToHtml(ts50, { lang: 'typescript', theme: 'vitesse-dark' })
  })
})

describe('codeToHtml — large TS (100x ~220 KB)', () => {
  bench('codeToHtml', () => {
    highlighter.codeToHtml(ts100, { lang: 'typescript', theme: 'vitesse-dark' })
  })
})

describe('codeToHtml — large MD (10x ~37 KB)', () => {
  bench('codeToHtml', () => {
    highlighter.codeToHtml(md10, { lang: 'markdown', theme: 'vitesse-dark' })
  })
})

describe('codeToHtml — large MD (50x ~185 KB)', () => {
  bench('codeToHtml', () => {
    highlighter.codeToHtml(md50, { lang: 'markdown', theme: 'vitesse-dark' })
  })
})

describe('multi-theme — large TS (10x)', () => {
  bench('codeToHtml light+dark', () => {
    highlighter.codeToHtml(ts10, {
      lang: 'typescript',
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    })
  })
})
