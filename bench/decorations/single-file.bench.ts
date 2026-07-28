import type { DecorationItem } from 'shiki'
import { createHighlighter, createOnigurumaEngine } from 'shiki'
import { afterAll, bench, describe } from 'vitest'

const lineCount = 5_000
const code = Array.from(
  { length: lineCount },
  (_, line) => `const value${line.toString().padStart(5, '0')} = compute(${line}, 'before');`,
).join('\n')
const decorations: DecorationItem[] = Array.from(
  { length: lineCount },
  (_, line) => ({
    start: { line, character: 8 },
    end: { line, character: 13 },
    properties: { class: 'highlighted' },
  }),
)

const engine = await createOnigurumaEngine(() => import('shiki/wasm'))
const highlighter = await createHighlighter({
  engine,
  langs: ['typescript'],
  themes: ['vitesse-dark'],
})

afterAll(() => highlighter.dispose())

describe(`single file (${lineCount} lines and decorations)`, () => {
  bench('default decoration rendering', () => {
    highlighter.codeToHast(code, {
      decorations,
      lang: 'typescript',
      theme: 'vitesse-dark',
    })
  }, {
    iterations: 3,
    time: 0,
    warmupIterations: 1,
    warmupTime: 0,
  })
})
