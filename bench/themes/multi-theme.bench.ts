import fs from 'node:fs'
import { createHighlighter, createOnigurumaEngine } from 'shiki'
import { afterAll, it } from 'vitest'

const code = fs.readFileSync(new URL('../../packages/core/src/highlight/code-to-hast.ts', import.meta.url), 'utf-8')

const engine = await createOnigurumaEngine(() => import('shiki/wasm'))
const highlighter = await createHighlighter({
  engine,
  langs: ['typescript'],
  themes: ['github-light', 'github-dark', 'github-dark-dimmed'],
})

afterAll(() => highlighter.dispose())

const cases = {
  'one theme': { theme: 'github-dark' },
  'two themes': { themes: { light: 'github-light', dark: 'github-dark' } },
  'three themes': { themes: { light: 'github-light', dark: 'github-dark', dim: 'github-dark-dimmed' } },
} as const

for (const [name, themes] of Object.entries(cases)) {
  it(`codeToHtml, ${name}`, async ({ bench }) => {
    await bench(name, () => {
      highlighter.codeToHtml(code, { lang: 'typescript', ...themes })
    }).run({ iterations: 30, time: 0, warmupIterations: 3, warmupTime: 0 })
  })
}
