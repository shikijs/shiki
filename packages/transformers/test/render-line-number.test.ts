import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerRenderLineNumber } from '../src/transformers/render-line-number'

describe('transformerRenderLineNumber', () => {
  it('basic', async () => {
    const code = `console.log('hello')
console.log('world')`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerRenderLineNumber(),
      ],
    })

    expect(html).toMatchSnapshot()
  })

  it('custom class', async () => {
    const code = `console.log('hello')`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerRenderLineNumber({
          classLineNumber: 'my-line-number',
        }),
      ],
    })

    expect(html).toContain('class="my-line-number"')
    expect(html).toMatchSnapshot()
  })

  it('custom start number', async () => {
    const code = `console.log('hello')
console.log('world')`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerRenderLineNumber({
          startNumber: 10,
        }),
      ],
    })

    expect(html).toContain('>10</span>')
    expect(html).toContain('>11</span>')
    expect(html).toMatchSnapshot()
  })
})
