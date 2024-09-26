/* eslint-disable no-console */
import type { BundledLanguage } from 'shiki'
import type { ReportItem } from '../scripts/report-engine-js-compat'
import fs from 'node:fs/promises'
import { createHighlighter, createJavaScriptRegexEngine, createOnigurumaEngine } from 'shiki'
import { bench, describe } from 'vitest'

const js = createJavaScriptRegexEngine()
const wasm = await createOnigurumaEngine(() => import('shiki/wasm'))

const RANGE = [0, 20]

// Run `npx jiti scripts/report-engine-js-compat.ts` to generate the report first
const report = await fs.readFile(new URL('../scripts/report-engine-js-compat.json', import.meta.url), 'utf-8').then(JSON.parse) as ReportItem[]
const langs = report.filter(i => i.highlightMatch === true).map(i => i.lang).slice(...RANGE) as BundledLanguage[]
// Clone https://github.com/shikijs/textmate-grammars-themes to `../tm-grammars-themes`
const samples = await Promise.all(langs.map(lang => fs.readFile(`../tm-grammars-themes/samples/${lang}.sample`, 'utf-8')))

console.log('Benchmarking engines with', langs.length, 'languages')

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

for (const lang of langs) {
  describe(lang, () => {
    bench('js', () => {
      shikiJs.codeToTokensBase(samples[langs.indexOf(lang)], { lang, theme: 'vitesse-dark' })
    })

    bench('wasm', () => {
      shikiWasm.codeToTokensBase(samples[langs.indexOf(lang)], { lang, theme: 'vitesse-dark' })
    })
  })
}
