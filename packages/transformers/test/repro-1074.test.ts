import { codeToHtml } from 'shiki'
import { expect, it } from 'vitest'
import { transformerNotationDiff } from '../src'

it('repro #1074: supports diff notation in string literals', async () => {
  const code = `
const a = "remove me // [!code --]"
const b = "keep me"
  `.trim()

  const html = await codeToHtml(code, {
    lang: 'js',
    theme: 'nord',
    transformers: [
      transformerNotationDiff(),
    ],
  })

  expect(html).toContain('diff remove')
})
