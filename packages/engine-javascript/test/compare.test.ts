import type { OnigString } from '../../core/src/textmate'
import type { LanguageRegistration, RegexEngine, ThemeRegistration } from '../../shiki/src/core'
import type { Execution } from './types'

import { hash as createHash } from 'ohash'
import { describe, expect, it } from 'vitest'
import { createOnigurumaEngine, loadWasm } from '../../engine-oniguruma/src'
import { createHighlighterCore } from '../../shiki/src/core'
import { createJavaScriptRegexEngine } from '../src/engine-compile'

function createEngineWrapper(engine: RegexEngine): RegexEngine & { executions: Execution[] } {
  const executions: Execution[] = []

  return {
    executions,
    createScanner(patterns) {
      const scanner = engine.createScanner(patterns)

      return {
        findNextMatchSync(string: string | OnigString, startPosition: number, options) {
          const result = scanner.findNextMatchSync(string, startPosition, options)
          executions.push({
            id: createHash({ patterns }),
            patterns,
            args: [typeof string === 'string' ? string : string.content, startPosition, options],
            result,
          })
          return result
        },
      }
    },
    createString(s) {
      return engine.createString(s)
    },
  }
}

export interface Cases {
  name: string
  skip?: boolean
  theme: () => Promise<{ default: ThemeRegistration }>
  lang: () => Promise<{ default: LanguageRegistration[] }>
  cases: string[]
}

const cases: Cases[] = [
  {
    name: 'beancount',
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/beancount'),
    cases: [
      `2012-11-03 * "Transfer to pay credit card"
  Assets:MyBank:Checking            -400.00 USD
  Liabilities:CreditCard             400.00 USD

2012-11-03 * "Transfer to account in Canada"
  Assets:MyBank:Checking            -400.00 USD @ 1.09 CAD
  Assets:FR:SocGen:Checking          436.01 CAD

; https://beancount.github.io/docs/beancount_language_syntax.html#costs-and-prices`,
    ],
  },
  {
    name: 'json-basic',
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/json'),
    cases: [
      '{"foo":{"bar":1}}',
      '[undefined, null, true, false, 0, 1, 1.1, "foo", [], {}]',
    ],
  },
  {
    name: 'html-basic',
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/html'),
    cases: [
      '<div class="foo">bar</div>',
      '<!DOCTYPE html><html><head><title>foo</title></head><body>bar</body></html>',
    ],
  },
  {
    name: 'ts-basic',
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/typescript'),
    cases: [
      'const foo: string = "bar"',
    ],
  },
  {
    name: 'jsonc',
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/jsonc'),
    cases: [
      '// comment\n{"foo":"bar"}',
    ],
  },
  {
    name: 'vue',
    theme: () => import('@shikijs/themes/vitesse-dark'),
    lang: () => import('@shikijs/langs/vue'),
    cases: [
      `<script setup>\nimport { ref } from 'vue'\n</script>`,
      `<template>\n<div>{{ foo }}</div>\n</template>`,
    ],
  },
  {
    name: 'toml',
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/toml'),
    cases: [
      [
        `# This is a TOML document`,
        '',
        `title = "TOML Example"`,
        '',
        '[owner]',
        'name = "Tom Preston-Werner"',
      ].join('\n'),
    ],
  },
  {
    name: 'sql',
    skip: true,
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/sql'),
    cases: [
      'SELECT * FROM foo',
      [
        'USE AdventureWorks2022;',
        'GO',
        'IF OBJECT_ID(\'dbo.NewProducts\', \'U\') IS NOT NULL',
        'DROP TABLE dbo.NewProducts;',
      ].join('\n'),
    ],
  },
  {
    name: 'markdown',
    theme: () => import('@shikijs/themes/nord'),
    lang: () => import('@shikijs/langs/markdown'),
    cases: [
      [
        '# Header',
        '',
        'This is a paragraph',
        '',
        '```ts',
        'const foo = "bar"',
        '```',
      ].join('\n'),
      [
        'look like:',
        '',
        '  * this one',
        '  * that one',
        '  * the other one',
        '',
        'and this',
      ].join('\n'),
    ],
  },
]

describe('cases', async () => {
  await loadWasm(import('@shikijs/engine-oniguruma/wasm-inlined'))

  const resolved = await Promise.all(cases.map(async (c) => {
    const theme = await c.theme().then(r => r.default)
    const lang = await c.lang().then(r => r.default)
    return {
      theme,
      lang,
      c,
    }
  }))

  for (const c of resolved) {
    const run = c.c.skip ? it.skip : it
    run(c.c.name, async () => {
      const engineWasm = createEngineWrapper(
        await createOnigurumaEngine(),
      )
      const engineJs = createEngineWrapper(
        createJavaScriptRegexEngine({
          forgiving: true,
        }),
      )

      using shiki1 = await createHighlighterCore({
        langs: c.lang,
        themes: [c.theme],
        engine: engineWasm,
      })
      using shiki2 = await createHighlighterCore({
        langs: c.lang,
        themes: [c.theme],
        engine: engineJs,
      })

      const lang = c.lang[0].name
      const theme = c.theme.name!

      const compare: [any, any][] = []

      for (const code of c.c.cases) {
        compare.push([
          shiki1.codeToTokensBase(code, { lang, theme }),
          shiki2.codeToTokensBase(code, { lang, theme }),
        ])
      }

      await expect
        .soft(`${JSON.stringify(engineWasm.executions, null, 2)}\n`)
        .toMatchFileSnapshot(`./__records__/${c.c.name}.wasm.json`)

      await expect
        .soft(`${JSON.stringify(engineJs.executions, null, 2)}\n`)
        .toMatchFileSnapshot(`./__records__/${c.c.name}.js.json`)

      // compare.forEach(([a, b]) => {
      //   expect.soft(a).toEqual(b)
      //   // await expect.soft(a)
      //   //   .toMatchFileSnapshot(`./__records__/tokens/${c.c.name}-${i}.json`)
      // })
    })
  }
})
