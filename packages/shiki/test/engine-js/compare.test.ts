import { describe, expect, it } from 'vitest'
import { wasmBinary } from '@shikijs/core/wasm-inlined'
import type { RegexEngine } from '@shikijs/core/textmate'
import type { LanguageRegistration, ThemeRegistration } from '../../src/core'
import { createHighlighterCore, createJavaScriptRegexEngine, loadWasm } from '../../src/core'

import { OnigScanner, OnigString } from '../../../core/src/engines/oniguruma'
import type { Instance } from './types'

await loadWasm({ instantiator: obj => WebAssembly.instantiate(wasmBinary, obj) })

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
  theme: () => Promise<{ default: ThemeRegistration }>
  lang: () => Promise<{ default: LanguageRegistration[] }>
  cases: string[]
}

const cases: Cases[] = [
  {
    name: 'json-basic',
    theme: () => import('../../src/assets/themes/nord'),
    lang: () => import('../../src/assets/langs/json'),
    cases: [
      '{"foo":{"bar":1}}',
      '[undefined, null, true, false, 0, 1, 1.1, "foo", [], {}]',
    ],
  },
  {
    name: 'html-basic',
    theme: () => import('../../src/assets/themes/nord'),
    lang: () => import('../../src/assets/langs/html'),
    cases: [
      '<div class="foo">bar</div>',
      '<!DOCTYPE html><html><head><title>foo</title></head><body>bar</body></html>',
    ],
  },
  {
    name: 'ts-basic',
    theme: () => import('../../src/assets/themes/nord'),
    lang: () => import('../../src/assets/langs/typescript'),
    cases: [
      'const foo: string = "bar"',
    ],
  },
  {
    name: 'jsonc',
    theme: () => import('../../src/assets/themes/nord'),
    lang: () => import('../../src/assets/langs/jsonc'),
    cases: [
      '// comment\n{"foo":"bar"}',
    ],
  },
]

describe('cases', async () => {
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
    it(c.c.name, async () => {
      const wasm = createWasmOnigLibWrapper()
      const native = createJavaScriptRegexEngine()

      const shiki1 = await createHighlighterCore({
        langs: c.lang,
        themes: [c.theme],
        engine: wasm,
      })
      const shiki2 = await createHighlighterCore({
        langs: c.lang,
        themes: [c.theme],
        engine: native,
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

      await expect(JSON.stringify(wasm.instances, null, 2))
        .toMatchFileSnapshot(`./__records__/${c.c.name}.json`)

      for (const [a, b] of compare) {
        expect.soft(a).toEqual(b)
      }
    })
  }
})
