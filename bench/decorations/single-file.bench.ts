import type { DecorationItem } from 'shiki'
import { createHighlighter, createOnigurumaEngine } from 'shiki'
import { afterAll, it } from 'vitest'

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

it(`single file (${lineCount} lines and decorations)`, async ({ bench }) => {
  await bench('default decoration rendering', () => {
    highlighter.codeToHast(code, {
      decorations,
      lang: 'typescript',
      theme: 'vitesse-dark',
    })
  }).run({
    iterations: 3,
    time: 0,
    warmupIterations: 1,
    warmupTime: 0,
  })
})

const wordLineCount = 20_000
const plainCode = Array.from(
  { length: wordLineCount },
  (_, line) => `const value${line.toString().padStart(5, '0')} = compute(${line}, 'before');`,
).join('\n')
// Two decorations per line, like word-level diff highlights.
const wordDecorations: DecorationItem[] = Array.from(
  { length: wordLineCount },
  (_, line): DecorationItem[] => [
    { start: { line, character: 6 }, end: { line, character: 16 } },
    { start: { line, character: 27 }, end: { line, character: 35 } },
  ],
).flat()

it(`plain text (${wordLineCount} lines, ${wordDecorations.length} decorations)`, async ({ bench }) => {
  await bench('plain text decoration rendering', () => {
    highlighter.codeToHast(plainCode, {
      decorations: wordDecorations,
      lang: 'text',
      theme: 'vitesse-dark',
    })
  }).run({
    iterations: 3,
    time: 0,
    warmupIterations: 1,
    warmupTime: 0,
  })
})
