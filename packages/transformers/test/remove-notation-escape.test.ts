import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerRemoveNotationEscape } from '../src'

describe('transformerRemoveNotationEscape', () => {
  it('unescapes multiple escaped notations in the same comment', async () => {
    const code = `console.log('hello') // [\\!code error] [\\!code focus]`
    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerRemoveNotationEscape(),
      ],
    })

    expect(html).toContain('[!code error]')
    expect(html).toContain('[!code focus]')
    expect(html).not.toContain('[\\!code')
  })
})
