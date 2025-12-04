import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerNotationFold } from '../src'

describe('transformerNotationFold', () => {
  it('shiki', async () => {
    const code = `
// [!code fold:start] variables
let a = 1

// [!code fold:start] variable b
let b = 1
// [!code fold:end]

// [!code fold:end]

console.log(a, b)
    `.trim()

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationFold(),
      ],
    })

    await expect(html).toMatchFileSnapshot('./fixtures/fold/shiki.output.html')
  })

  it('region', async () => {
    const code = `
// #region variables
let a = 1

// #region variable b
let b = 1
// #endregion

// #endregion

console.log(a, b)
    `.trim()

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationFold(),
      ],
    })

    await expect(html).toMatchFileSnapshot('./fixtures/fold/region.output.html')
  })
})
