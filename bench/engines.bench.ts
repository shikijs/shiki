import fs from 'node:fs/promises'
import { bench, describe } from 'vitest'
import type { BundledLanguage } from 'shiki'
import { createHighlighter, createJavaScriptRegexEngine, createWasmOnigEngine } from 'shiki'
import type { ReportItem } from '../scripts/report-engine-js-compat'

describe('engines', async () => {
  const js = createJavaScriptRegexEngine()
  const wasm = await createWasmOnigEngine(() => import('shiki/wasm'))

  // Run `npx jiti scripts/report-engine-js-compat.ts` to generate the report first
  const report = await fs.readFile('../scripts/report-engine-js-compat.json', 'utf-8').then(JSON.parse) as ReportItem[]
  const langs = report.filter(i => i.highlightMatch === true).map(i => i.lang) as BundledLanguage[]
  const samples = await Promise.all(langs.map(lang => fs.readFile(`../tm-grammars-themes/samples/${lang}.sample`, 'utf-8')))

  const shikiJs = await createHighlighter({
    langs,
    themes: ['vitesse-dark'],
    engine: js,
  })

  const shikiWasm = await createHighlighter({
    langs,
    themes: ['vitesse-dark'],
    engine: wasm,
  })

  bench('js', () => {
    for (const lang of langs) {
      shikiJs.codeToTokensBase(samples[langs.indexOf(lang)], { lang, theme: 'vitesse-dark' })
    }
  }, { warmupIterations: 10, iterations: 30 })

  bench('wasm', () => {
    for (const lang of langs) {
      shikiWasm.codeToTokensBase(samples[langs.indexOf(lang)], { lang, theme: 'vitesse-dark' })
    }
  }, { warmupIterations: 10, iterations: 30 })
})
