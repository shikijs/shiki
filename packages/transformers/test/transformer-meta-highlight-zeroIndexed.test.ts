import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerMetaHighlight } from '../src'

const input = `
console.log("line 0")
console.log("line 1")
console.log("line 2")
console.log("line 3")
`.trim()

describe('transformerMetaHighlight - zeroIndexed behavior', () => {
  it('default mode should treat meta as 1-indexed', async () => {
    const html = await codeToHtml(input, {
      lang: 'js',
      theme: 'nord',
      meta: { __raw: '{1,3}' },
      transformers: [transformerMetaHighlight()],
    })
    expect(html).toMatchSnapshot()
  })

  it('when zeroIndexed=true it should treat meta as 0-indexed', async () => {
    const html = await codeToHtml(input, {
      lang: 'js',
      theme: 'nord',
      meta: { __raw: '{1,3}' },
      transformers: [transformerMetaHighlight({ zeroIndexed: true })],
    })
    expect(html).toMatchSnapshot()
  })
})
