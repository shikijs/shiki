import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerRemoveEmptyLines } from '../src'

describe('transformer-remove-empty-lines', () => {
  it('removes empty lines', async () => {
    const code = `
line 1

line 2
  
line 3
`
    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerRemoveEmptyLines(),
      ],
    })

    expect(html).toMatchSnapshot()
  })
})
