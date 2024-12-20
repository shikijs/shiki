// To run this script
// - `pnpm run build`
// - `pnpm run report-engine-js`

import type { Diff } from 'diff-match-patch-es'
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'
import fs from 'node:fs/promises'
import process from 'node:process'
import { diffCleanupSemantic, diffMain } from 'diff-match-patch-es'
import c from 'picocolors'
import { format } from 'prettier'
import { bundledLanguages, createHighlighter, createJavaScriptRegexEngine } from 'shiki'
import { version } from '../package.json'

const engine = createJavaScriptRegexEngine({
  target: 'ES2024',
})
const engineForgiving = createJavaScriptRegexEngine({
  target: 'ES2024',
  forgiving: true,
})

export interface ReportItem {
  lang: string
  highlightMatch: boolean | 'error'
  patternsParsable: number
  patternsFailed: [string, unknown][]
  highlightA?: string
  highlightB?: string
  diff: Diff[]
}

async function run() {
  const report: ReportItem[] = []

  await fs.rm(new URL('./compares', import.meta.url), { recursive: true, force: true })

  for (const lang of Object.keys(bundledLanguages)) {
    const sample = await fs
      .readFile(`../tm-grammars-themes/samples/${lang}.sample`, 'utf-8')
      .catch(() => '')

    if (!sample) {
      console.log(c.dim(`[${lang}] Sample not found`))
      continue
    }

    let shiki = null
    const parsablePatterns: string[] = []
    const unparsablePatterns: [string, unknown][] = []

    const shikiWasm = await createHighlighter({
      langs: [lang],
      themes: ['vitesse-dark'],
    })

    const grammars = shikiWasm.getLoadedLanguages().map(l => shikiWasm.getLanguage(l))
    const patterns = new Set<string>()
    grammars.map((grammar: any) => getPatternsOfGrammar(grammar._grammar, patterns))
    let highlightMatch: boolean | 'error' = false

    for (const pattern of patterns) {
      try {
        engine.createScanner([pattern])
        parsablePatterns.push(pattern)
      }
      catch (e: any) {
        unparsablePatterns.push([pattern, String(e.cause || e)])
      }
    }

    const highlightA = serializeTokens(shikiWasm, sample, lang)
    let highlightB: { tokens: string, html: string } | undefined
    let highlightDiff: Diff[] = []

    try {
      shiki = await createHighlighter({
        langs: [lang],
        themes: ['vitesse-dark'],
        engine,
      })

      highlightB = serializeTokens(shiki, sample, lang)
    }
    catch (e: any) {
      highlightMatch = 'error'
      console.log(c.red(`[${lang}] Error ${e} ${e.cause || ''}`))
    }
    finally {
      shiki?.dispose()
    }

    try {
      shiki = await createHighlighter({
        langs: [lang],
        themes: ['vitesse-dark'],
        engine: engineForgiving,
      })

      highlightB = serializeTokens(shiki, sample, lang)
    }
    catch (e: any) {
      console.log(c.red(`[${lang}] Error ${e} ${e.cause || ''}`))
    }
    finally {
      shiki?.dispose()
    }

    if (highlightMatch !== 'error')
      highlightMatch = highlightA.html === highlightB?.html
    highlightDiff = highlightB && highlightA !== highlightB
      ? diffMain(highlightA.tokens, highlightB.tokens)
      : []
    diffCleanupSemantic(highlightDiff)

    if (highlightB && highlightMatch !== true) {
      console.log(c.yellow(`[${lang}] Mismatch`))

      await fs.mkdir(new URL('./compares', import.meta.url), { recursive: true })

      await fs.writeFile(
        new URL(`./compares/${lang}.html`, import.meta.url),
        [
          '<style>',
          'body { display: flex; }',
          'pre { flex: 1; margin: 0; padding: 0; }',
          '</style>',
          '<pre>',
          highlightA.html,
          '</pre>',
          '<pre>',
          highlightB?.html,
          '</pre>',
        ].join('\n'),
        'utf-8',
      )
    }
    else {
      console.log(c.green(`[${lang}] OK`))
    }

    report.push({
      lang,
      highlightMatch,
      patternsParsable: parsablePatterns.length,
      patternsFailed: unparsablePatterns,
      ...highlightMatch === true
        ? {}
        : {
            highlightA: highlightA.html,
            highlightB: highlightB?.html,
          },
      diff: highlightDiff,
    })

    shikiWasm?.dispose()
    shiki?.dispose()
  }

  const order = [true, false, 'error']

  report
    .sort((a, b) => {
      const aOrder = order.indexOf(a.highlightMatch)
      const bOrder = order.indexOf(b.highlightMatch)

      if (aOrder !== bOrder)
        return aOrder - bOrder

      return (a.patternsFailed.length - b.patternsFailed.length) || a.lang.localeCompare(b.lang)
    })

  await fs.writeFile(
    new URL('./report-engine-js-compat.json', import.meta.url),
    JSON.stringify(report, null, 2),
  )

  function createTable(report: ReportItem[]) {
    const table: readonly [string, string, string, string, string][] = [
      ['Language', 'Highlight Match', 'Patterns Parsable', 'Patterns Failed', 'Diff'],
      ['---', ':---', '---:', '---:', '---:'],
      ...report
        .map((item) => {
          const diffChars = item.diff.map(diff => diff[0] === 1 ? diff[1].length : 0).reduce((a, b) => a + b, 0)
          return [
            item.lang,
            item.highlightMatch === true ? '✅ OK' : item.highlightMatch === 'error' ? '❌ Error' : `[🚧 Mismatch](https://textmate-grammars-themes.netlify.app/?grammar=${item.lang})`,
            item.patternsParsable === 0 ? '-' : item.patternsParsable.toString(),
            item.patternsFailed.length === 0 ? '-' : item.patternsFailed.length.toString(),
            diffChars ? diffChars.toString() : '',
          ] as [string, string, string, string, string]
        }),
    ]

    return table.map(row => `| ${row.join(' | ')} |`).join('\n')
  }

  const reportOk = report.filter(item => item.highlightMatch === true && item.patternsFailed.length === 0)
  const reportMismatch = report.filter(item => item.highlightMatch === false && item.patternsFailed.length === 0)
  const reportError = report.filter(item => item.highlightMatch === 'error' || item.patternsFailed.length > 0)

  let markdown = [
    '# JavaScript RegExp Engine Compatibility References',
    '',
    'Compatibility reference of all built-in grammars with the [JavaScript RegExp engine](/guide/regex-engines#javascript-regexp-engine).',
    '',
    `> Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })} `,
    '>',
    `> Version \`${version}\``,
    '>',
    `> Runtime: Node.js v${process.versions.node}`,
    '',

    '## Report Summary',
    '',
    '|  | Count |',
    '| :--- | ---: |',
    `| Total Languages | ${report.length} |`,
    `| Supported | [${reportOk.length}](#supported-languages) |`,
    `| Mismatched | [${reportMismatch.length}](#mismatched-languages) |`,
    `| Unsupported | [${reportError.length}](#unsupported-languages) |`,
    '',
    '## Supported Languages',
    '',
    'Languages that work with the JavaScript RegExp engine, and will produce the same result as the WASM engine (with the [sample snippets in the registry](https://github.com/shikijs/textmate-grammars-themes/tree/main/samples)).',
    'In some edge cases, it\'s not guaranteed that the highlighting will be 100% the same. If that happens, please create an issue with the sample snippet.',
    '',
    createTable(reportOk),
    '',
    '###### Table Field Explanations',
    '',
    '- **Highlight Match**: Whether the highlighting results matched with the WASM engine for the [sample snippet](https://github.com/shikijs/textmate-grammars-themes/tree/main/samples).',
    '- **Patterns Parsable**: Number of regex patterns that can be parsed by the JavaScript RegExp engine.',
    '- **Patterns Failed**: Number of regex patterns that can\'t be parsed by the JavaScript RegExp engine (throws error).',
    '- **Diff**: Length of characters that are different between the highlighting results of the two engines.',
    '',
    '## Mismatched Languages',
    '',
    'Languages that do not throw with the JavaScript RegExp engine, but will produce different results than the WASM engine. Please use with caution.',
    '',
    createTable(reportMismatch),
    '',
    '## Unsupported Languages',
    '',
    'Languages that throw with the JavaScript RegExp engine, either because they contain syntax we can\'t polyfill yet or because the grammar contains an invalid Oniguruma regex (that would also fail when using the WASM engine, but silently). You can try these languages with the `forgiving` option to skip errors.',
    '',
    createTable(reportError),
  ].join('\n')

  markdown = await format(
    markdown,
    {
      parser: 'markdown',
      singleQuote: true,
      semi: false,
      printWidth: 100,
    },
  )

  await fs.writeFile(
    new URL('../docs/references/engine-js-compat.md', import.meta.url),
    markdown,
  )
}

function serializeTokens(shiki: HighlighterGeneric<BundledLanguage, BundledTheme>, sample: string, lang: string) {
  const tokens = shiki
    .codeToTokensBase(sample, { lang: lang as any, theme: 'vitesse-dark' })
    .flat(1)
    .map(t => t.color?.padEnd(18, ' ') + t.content)
    .join('\n')
  const html = shiki
    .codeToHtml(sample, { lang: lang as any, theme: 'vitesse-dark' })
  return {
    tokens,
    html,
  }
}

function getPatternsOfGrammar(grammar: any, set = new Set<string>()): Set<string> {
  function traverse(a: any): void {
    if (Array.isArray(a)) {
      a.forEach((j: any) => {
        traverse(j)
      })
      return
    }
    if (!a || typeof a !== 'object')
      return
    if (a.foldingStartMarker) {
      set.add(a.foldingStartMarker)
    }
    if (a.foldingStopMarker) {
      set.add(a.foldingStopMarker)
    }
    if (a.firstLineMatch) {
      set.add(a.firstLineMatch)
    }
    if (a.match)
      set.add(a.match)
    if (a.begin)
      set.add(a.begin)
    if (a.end)
      set.add(a.end)
    if (a.while)
      set.add(a.while)
    if (a.patterns) {
      traverse(a.patterns)
    }
    if (a.captures) {
      traverse(Object.values(a.captures))
    }
    if (a.beginCaptures) {
      traverse(Object.values(a.beginCaptures))
    }
    if (a.endCaptures) {
      traverse(Object.values(a.endCaptures))
    }
    Object.values(a.repository || {}).forEach((j: any) => {
      traverse(j)
    })
  }

  traverse(grammar)

  return set
}

run()
