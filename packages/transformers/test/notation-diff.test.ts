import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'

import { transformerNotationDiff } from '../src/transformers/notation-diff'

async function transform(code: string, theme: string) {
  const highlighter = await createHighlighter({
    themes: [theme],
    langs: ['javascript'],
  })

  return highlighter.codeToHtml(code, {
    lang: 'javascript',
    theme,
    transformers: [transformerNotationDiff()],
  })
}

it('parseHighlightLines', async () => {
  const code = 'const a = 1 // [!code --]'

  expect(await transform(code, 'dracula')).toMatch(/diff/)
  expect(await transform(code, 'rose-pine')).toMatch(/diff/)
})
