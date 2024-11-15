import type { LanguageRegistration, RegexEngine, ThemeRegistration } from '../../shiki/src/core'
import type { Instance } from './types'
import { describe, expect, it } from 'vitest'

import { loadWasm } from '../../engine-oniguruma/src'
import { OnigScanner, OnigString } from '../../engine-oniguruma/src/oniguruma'
import { createHighlighterCore } from '../../shiki/src/core'
import { createJavaScriptRegexEngine } from '../src'

function createWasmOnigLibWrapper(): RegexEngine & { instances: Instance[] } {
  const instances: Instance[] = []

  return {
    instances,
    createScanner(patterns) {
      const scanner = new OnigScanner(patterns)
      const instance: Instance = {
        constractor: [patterns],
        executions: [],
      }
      instances.push(instance)
      return {
        findNextMatchSync(string: string | OnigString, startPosition: number) {
          const result = scanner.findNextMatchSync(string, startPosition)
          instance.executions.push({ args: [typeof string === 'string' ? string : string.content, startPosition], result })
          return result
        },
      }
    },
    createString(s) {
      return new OnigString(s)
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
    name: 'json-basic',
    theme: () => import('../../shiki/src/themes/nord.mjs'),
    lang: () => import('../../shiki/src/langs/json.mjs'),
    cases: [
      '{"foo":{"bar":1}}',
      '[undefined, null, true, false, 0, 1, 1.1, "foo", [], {}]',
    ],
  },
  {
    name: 'html-basic',
    theme: () => import('../../shiki/src/themes/nord.mjs'),
    lang: () => import('../../shiki/src/langs/html.mjs'),
    cases: [
      '<div class="foo">bar</div>',
      '<!DOCTYPE html><html><head><title>foo</title></head><body>bar</body></html>',
    ],
  },
  {
    name: 'ts-basic',
    theme: () => import('../../shiki/src/themes/nord.mjs'),
    lang: () => import('../../shiki/src/langs/typescript.mjs'),
    cases: [
      'const foo: string = "bar"',
    ],
  },
  {
    name: 'jsonc',
    theme: () => import('../../shiki/src/themes/nord.mjs'),
    lang: () => import('../../shiki/src/langs/jsonc.mjs'),
    cases: [
      '// comment\n{"foo":"bar"}',
    ],
  },
  {
    name: 'vue',
    theme: () => import('../../shiki/src/themes/vitesse-dark.mjs'),
    lang: () => import('../../shiki/src/langs/vue.mjs'),
    cases: [
      `<script setup>\nimport { ref } from 'vue'\n</script>`,
      `<template>\n<div>{{ foo }}</div>\n</template>`,
    ],
  },
  {
    name: 'toml',
    theme: () => import('../../shiki/src/themes/nord.mjs'),
    lang: () => import('../../shiki/src/langs/toml.mjs'),
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
    theme: () => import('../../shiki/src/themes/nord.mjs'),
    lang: () => import('../../shiki/src/langs/sql.mjs'),
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
    skip: true,
    name: 'markdown',
    theme: () => import('../../shiki/src/themes/nord.mjs'),
    lang: () => import('../../shiki/src/langs/markdown.mjs'),
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

describe.skipIf(
  +process.versions.node.split('.')[0] < 20,
)('cases', async () => {
  await loadWasm(import('@shikijs/core/wasm-inlined'))

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
      const engineWasm = createWasmOnigLibWrapper()
      const engineJs = createJavaScriptRegexEngine({
        forgiving: true,
        target: 'ES2024',
      })

      const shiki1 = await createHighlighterCore({
        langs: c.lang,
        themes: [c.theme],
        engine: engineWasm,
      })
      const shiki2 = await createHighlighterCore({
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
        .soft(JSON.stringify(engineWasm.instances, null, 2))
        .toMatchFileSnapshot(`./__records__/${c.c.name}.json`)

      // compare.forEach(([a, b]) => {
      //   expect.soft(a).toEqual(b)
      //   // await expect.soft(a)
      //   //   .toMatchFileSnapshot(`./__records__/tokens/${c.c.name}-${i}.json`)
      // })
    })
  }
})
