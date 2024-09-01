// To run this script
// - `pnpm run build`
// - `pnpm run report-engine-js`

import fs from 'node:fs/promises'
import process from 'node:process'
import { bundledLanguages, createHighlighter, createJavaScriptRegexEngine } from 'shiki'
import c from 'picocolors'
import { version } from '../package.json'

const engine = createJavaScriptRegexEngine()

export interface ReportItem {
  lang: string
  highlightMatch: boolean | 'error'
  patternsParsable: number
  patternsFailed: [string, unknown][]
  highlightA?: string
  highlightB?: string
}

async function run() {
  const report: ReportItem[] = []

  await fs.rm(new URL('./compares', import.meta.url), { recursive: true, force: true })

  for (const lang of Object.keys(bundledLanguages)) {
    const sample = await fs.readFile(`../tm-grammars-themes/samples/${lang}.sample`, 'utf-8')
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

    const grammar = shikiWasm.getLanguage(lang) as any
    const patterns = getPatternsOfGrammar(grammar._grammar)
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

    const highlightA = shikiWasm.codeToHtml(sample, { lang, theme: 'vitesse-dark' })
    let highlightB: string | undefined

    try {
      shiki = await createHighlighter({
        langs: [lang],
        themes: ['vitesse-dark'],
        engine,
      })

      highlightB = shiki.codeToHtml(sample, { lang, theme: 'vitesse-dark' })

      highlightMatch = highlightA === highlightB

      if (!highlightMatch) {
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
            highlightA,
            '</pre>',
            '<pre>',
            highlightB,
            '</pre>',
          ].join('\n'),
          'utf-8',
        )
      }
      else {
        console.log(c.green(`[${lang}] OK`))
      }
    }
    catch (e) {
      highlightMatch = 'error'
      console.log(c.red(`[${lang}] Error ${e}`))
    }
    finally {
      report.push({
        lang,
        highlightMatch,
        patternsParsable: parsablePatterns.length,
        patternsFailed: unparsablePatterns,
        ...highlightMatch === true
          ? {}
          : {
              highlightA,
              highlightB,
            },
      })

      shikiWasm?.dispose()
      shiki?.dispose()
    }
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
    const table: readonly [string, string, string, string][] = [
      ['Language', 'Highlight Match', 'Patterns Parsable', 'Patterns Failed'],
      ['---', ':---', '---:', '---:'],
      ...report
        .map(item => [
          item.lang,
          item.highlightMatch === true ? '✅ OK' : item.highlightMatch === 'error' ? '❌ Error' : '⚠️ Mismatch',
          item.patternsParsable === 0 ? '-' : item.patternsParsable.toString(),
          item.patternsFailed.length === 0 ? '-' : item.patternsFailed.length.toString(),
        ] as [string, string, string, string]),
    ]

    return table.map(row => `| ${row.join(' | ')} |`).join('\n')
  }

  const reportOk = report.filter(item => item.highlightMatch === true && item.patternsFailed.length === 0)
  const reportMismatch = report.filter(item => item.highlightMatch === false && item.patternsFailed.length === 0)
  const reportError = report.filter(item => item.highlightMatch === 'error' || item.patternsFailed.length > 0)

  const markdown = [
    '# JavaScript RegExp Engine Compatibility References',
    '',
    `> Genreated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })} `,
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
    `| Fully Supported | [${reportOk.length}](#fully-supported-languages) |`,
    `| Mismatched | [${reportMismatch.length}](#mismatched-languages) |`,
    `| Unsupported | [${reportError.length}](#unsupported-languages) |`,
    '',
    '## Fully Supported Languages',
    '',
    'Languages that works with the JavaScript RegExp engine, and will produce the same result as the WASM engine.',
    '',
    createTable(reportOk),
    '',
    '## Mismatched Languages',
    '',
    'Languages that does not throw with the JavaScript RegExp engine, but will produce different result than the WASM engine. Please use with caution.',
    '',
    createTable(reportMismatch),
    '',
    '## Unsupported Languages',
    '',
    'Languages that throws with the JavaScript RegExp engine (contains syntaxes that we can\'t polyfill yet). If you need to use these languages, please use the Oniguruma engine.',
    '',
    createTable(reportError),
  ].join('\n')

  await fs.writeFile(
    new URL('../docs/references/engine-js-compat.md', import.meta.url),
    markdown,
  )
}

function getPatternsOfGrammar(grammar: any) {
  const patterns = new Set<string>()

  const scan = (obj: any) => {
    if (!obj)
      return
    if (typeof obj.match === 'string')
      patterns.add(obj.match)
    if (typeof obj.begin === 'string')
      patterns.add(obj.begin)
    if (typeof obj.end === 'string')
      patterns.add(obj.end)
    if (obj.patterns)
      obj.patterns.forEach(scan)
    Object.values(obj.repository || {}).forEach(scan)
  }

  scan(grammar)

  return patterns
}

run()
