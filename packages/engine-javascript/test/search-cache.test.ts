import type { LanguageRegistration, RegexEngine, RegexEngineString, ShikiPrimitive, ThemedToken } from '@shikijs/types'
import { codeToTokensBase, createShikiPrimitive } from '@shikijs/primitive'
import { describe, expect, it, vi } from 'vitest'
import { createJavaScriptRegexEngine, JavaScriptScanner } from '../src'

// Same regexps, but strings without an id, so searches are never reused
function createUncachedEngine(options?: Parameters<typeof createJavaScriptRegexEngine>[0]): RegexEngine {
  return {
    ...createJavaScriptRegexEngine(options),
    createString: (s: string) => ({ content: s }),
  }
}

function countExecCalls(run: () => void): number {
  const exec = vi.spyOn(RegExp.prototype, 'exec')
  try {
    run()
    return exec.mock.calls.length
  }
  finally {
    exec.mockRestore()
  }
}

function fill(length: number, piece: (i: number) => string): string {
  let s = ''
  for (let i = 0; s.length < length; i++)
    s += piece(i)
  return s.slice(0, length)
}

// Long lines that are slow without reuse, plus snippets heavy in `\G` anchors and `while` rules
const LINE_LENGTH = 300
const lines: Record<string, string> = {
  punctuation: fill(LINE_LENGTH, () => ';'),
  dottedChain: fill(LINE_LENGTH, () => 'a.'),
  generics: fill(LINE_LENGTH, () => 'a<'),
  closeParens: fill(LINE_LENGTH, () => ')'),
  spaces: fill(LINE_LENGTH, () => ' '),
  escapedStars: fill(LINE_LENGTH, () => '\\*'),
  yamlAliases: fill(LINE_LENGTH, () => '*a '),
  argumentList: `const result = compute(${fill(LINE_LENGTH, i => `arg${i}, `)}`,
  objectLiteral: `const cfg = { ${fill(LINE_LENGTH, i => i % 2 ? `key${i}: "value${i}", ` : `key${i}: ${i * 3}, `)}`,
  minified: fill(LINE_LENGTH, () => 'function a(b,c){return b&&c||d?e:f}var g=h(1,2),i=[j,k];if(l){m.n(o)}else{p=q+"r"}'),
  json: `[${fill(LINE_LENGTH, i => `{"id":${i},"name":"item${i}","tags":["a","b"],"nested":{"x":1.5,"y":null,"ok":true}},`)}`,
  markdownInline: fill(LINE_LENGTH, i => `The **config${i}** option uses \`value_${i}\` and links to [the docs](https://example.com/${i}), see _notes_. `),
  logLine: fill(LINE_LENGTH, i => `2026-09-04T12:34:${10 + (i % 50)}.789Z INFO [worker-${i}] request id=abc${i} status=200 path=/api/v1/items/${i} `),
  jsx: `<div className="row">${fill(LINE_LENGTH, i => `<span key={${i}} className="cell" onClick={() => select(${i})}>{label${i}}</span>`)}`,
  shell: `docker run --rm ${fill(LINE_LENGTH, i => `-e VAR_${i}=value${i} -v /host/${i}:/container/${i} `)}`,
  pythonCall: `result = build(${fill(LINE_LENGTH, i => (i % 3 === 0 ? `p_${i}="s${i}", ` : i % 3 === 1 ? `p_${i}=True, ` : `p_${i}=${i}.5, `))}`,
  html: fill(LINE_LENGTH, i => `<div class="item item-${i}" data-id="${i}"><a href="/p/${i}">Item ${i}</a></div>`),
}

const snippets: Record<string, string[]> = {
  markdown: [
    '> > - a *b* `c`\n>   1. b\n> > > deep\n  - > quoted in list\n    > - list in quote in list\n1. x\n   2. y\n      > z **w**\n\n> # heading in quote\n> ---\n> ```ts\n> const a = 1;\n> ```\n- [ ] task\n- * nested star\n  * deeper\n    + > quote\n',
    '>>#',
    '>>***',
  ],
  shellscript: [
    'cat <<EOF\nline $VAR $(cmd) $X\nEOF\ncat <<-"X"\n\traw $no\n\tX\nX\necho done | grep -E "a|b" > /dev/null 2>&1 && f() { local x="$1"; }\ncase "$1" in\n  a|b) echo ab ;;\n  *) [[ $x =~ ^[0-9]+$ ]] && echo n ;;\nesac\n',
  ],
  typescript: [
    `const re = /a(b)[c-d]*\\/(?<n>x)/giu; const s = \`a \${b + \`c\`} d\`;
type T<K extends keyof U = "a" | "b"> = { [P in K]?: U[P] extends (infer R)[] ? R : never };
@dec class A<T> extends B implements C { #p = 1; static async *g() { yield* h(); } }
`,
  ],
  tsx: [
    'export function Row({ items }: { items: Item[] }) {\n  const [open, setOpen] = useState<boolean>(false);\n  return (<ul className={cx("row", { open })}>{items.map((it) => <li key={it.id} onClick={() => setOpen(!open)}>{it.label ?? "-"}</li>)}</ul>);\n}\n',
  ],
  python: [
    '@dataclass\nclass P:\n    x: int = 0\n    def f(self, *a, **k) -> "P":\n        match a:\n            case [1, *rest]: return P(x=len(rest))\n        s = f"{self.x!r:>8} {k.get("y", 0):.2f}"\n        """doc\n        string"""\n        return self  # c\n',
  ],
  yaml: [
    '%YAML 1.2\n---\na: &a { b: [1, 2], c: *a }\n? complex\n: key\nd: |\n  block\n  scalar\ne: >-\n  folded\n- ! &e tag\n~\n! &a x\n',
    ' ! &e',
    '~\n! &a',
  ],
  html: [
    `<!DOCTYPE html>
<html lang="en">
<head><style>a > b { color: red; }</style></head>
<body onload="init()">
<script type="module">import { x } from "./x.js"; x\`<p>\${1}</p>\`</script>
</body>
</html>
`,
  ],
  vue: [
    '<script setup lang="ts">\nimport { ref } from "vue"\nconst n = ref<number>(0)\n</script>\n\n<template>\n  <button :class="{ on: n > 0 }" @click="n++">{{ n }}</button>\n</template>\n\n<style scoped>\nbutton { color: v-bind(color); }\n</style>\n',
  ],
}

const langs: Record<string, () => Promise<{ default: LanguageRegistration[] }>> = {
  typescript: () => import('@shikijs/langs/typescript'),
  tsx: () => import('@shikijs/langs/tsx'),
  markdown: () => import('@shikijs/langs/markdown'),
  yaml: () => import('@shikijs/langs/yaml'),
  python: () => import('@shikijs/langs/python'),
  shellscript: () => import('@shikijs/langs/shellscript'),
  html: () => import('@shikijs/langs/html'),
  vue: () => import('@shikijs/langs/vue'),
}

describe('search cache', async () => {
  const theme = await import('@shikijs/themes/vitesse-dark').then(m => m.default)
  const grammars = (await Promise.all(Object.values(langs).map(load => load().then(m => m.default)))).flat()

  function highlighter(engine: RegexEngine): ShikiPrimitive {
    return createShikiPrimitive({ engine, langs: grammars, themes: [theme], warnings: false })
  }

  // Shared pattern cache, so both use the same RegExp objects
  const cache = new Map<string, RegExp | Error>()
  const cached = highlighter(createJavaScriptRegexEngine({ cache }))
  const uncached = highlighter(createUncachedEngine({ cache }))

  function tokenize(shiki: ShikiPrimitive, code: string, lang: string, includeExplanation = true): ThemedToken[][] {
    return codeToTokensBase(shiki, code, { lang, theme: theme.name!, includeExplanation, tokenizeTimeLimit: 0 })
  }

  it.each(Object.keys(langs))('gives the same tokens as searching every time (%s)', (lang) => {
    for (const [name, code] of [...Object.entries(lines), ...(snippets[lang] ?? []).map((s, i) => [`snippet ${i}`, s])]) {
      const actual = tokenize(cached, code, lang)
      const expected = tokenize(uncached, code, lang)
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        expect(actual, name).toEqual(expected)
    }
  })

  it('searches a long line far fewer times', () => {
    const line = fill(1000, i => `item${i}, `)
    const run = (shiki: ShikiPrimitive) => () => tokenize(shiki, line, 'typescript', false)
    // Warm up so regex compilation isn't counted
    run(cached)()
    run(uncached)()

    expect(countExecCalls(run(cached))).toBeLessThan(countExecCalls(run(uncached)) / 10)
  })
})

describe('scanner search reuse', () => {
  const engine = createJavaScriptRegexEngine()

  function createScanner(regexps: RegExp[]) {
    const scanner = new JavaScriptScanner(regexps, {
      regexConstructor: () => {
        throw new Error('unused')
      },
    })
    const execs = regexps.map(re => vi.spyOn(re, 'exec'))
    return { scanner, execs: () => execs.map(e => e.mock.calls.length) }
  }

  it('reuses a search until the position passes its match', () => {
    const { scanner, execs } = createScanner([/b/dg, /x/dg])
    const str = engine.createString('aaab aaab')

    expect(scanner.findNextMatchSync(str, 0, 0)).toMatchObject({ index: 0, captureIndices: [{ start: 3, end: 4, length: 1 }] })
    expect(scanner.findNextMatchSync(str, 2, 0)).toMatchObject({ index: 0, captureIndices: [{ start: 3 }] })
    expect(scanner.findNextMatchSync(str, 3, 0)).toMatchObject({ index: 0, captureIndices: [{ start: 3 }] })
    expect(execs()).toEqual([1, 1])

    expect(scanner.findNextMatchSync(str, 4, 0)).toMatchObject({ index: 0, captureIndices: [{ start: 8 }] })
    expect(execs()).toEqual([2, 1])

    expect(scanner.findNextMatchSync(str, 9, 0)).toBe(null)
    expect(execs()).toEqual([3, 1])
  })

  it('does not reuse a search from a later position, on another string, or on a plain string', () => {
    const { scanner, execs } = createScanner([/b/dg])
    const str = engine.createString('ab ab')

    scanner.findNextMatchSync(str, 3, 0)
    expect(scanner.findNextMatchSync(str, 0, 0)).toMatchObject({ captureIndices: [{ start: 1 }] })
    expect(execs()).toEqual([2])

    expect(scanner.findNextMatchSync(engine.createString('ab ab'), 0, 0)).toMatchObject({ captureIndices: [{ start: 1 }] })
    expect(execs()).toEqual([3])

    scanner.findNextMatchSync('ab ab', 0, 0)
    scanner.findNextMatchSync('ab ab', 0, 0)
    scanner.findNextMatchSync({ content: 'ab ab' } as RegexEngineString, 0, 0)
    expect(execs()).toEqual([6])
  })

  it('always searches sticky regexps and regexps with a search strategy', () => {
    const withStrategy = Object.assign(/(?<=a)b/dg, { rawOptions: { strategy: 'clip_search' } })
    const { scanner, execs } = createScanner([/x/dgy, withStrategy, /c/dg])
    const str = engine.createString('abcab')
    expect(scanner.findNextMatchSync(str, 0, 0)).toMatchObject({ index: 1, captureIndices: [{ start: 1 }] })
    expect(scanner.findNextMatchSync(str, 1, 0)).toMatchObject({ index: 1, captureIndices: [{ start: 1 }] })
    expect(scanner.findNextMatchSync(str, 2, 0)).toMatchObject({ index: 2, captureIndices: [{ start: 2 }] })
    expect(execs()).toEqual([3, 3, 1])
  })

  it('prefers the earliest match, then the earliest pattern', () => {
    const { scanner } = createScanner([/c/dg, /b/dg, /[bc]/dg])
    const str = engine.createString('abc')
    expect(scanner.findNextMatchSync(str, 0, 0)).toMatchObject({ index: 1 })
    expect(scanner.findNextMatchSync(str, 2, 0)).toMatchObject({ index: 0 })
  })
})
