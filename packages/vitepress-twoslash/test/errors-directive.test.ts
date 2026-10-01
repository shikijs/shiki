import { transformerTwoslash } from '@shikijs/twoslash'
import { codeToHast, hastToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { rendererFloatingVue } from '../src'

const officialRepro = `// @errors: 1005
let a = (4`

const relatedCases: Record<string, string> = {
  'errors-colon-1005': officialRepro,
  'errors-colon-1005-trailing-newline': `${officialRepro}\n`,
  'errors-colon-1005-unclosed-brace': `// @errors: 1005
let a = {`,
}

const goodCase = `console.log('hello')
//      ^?`

async function highlight(code: string) {
  return codeToHast(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerTwoslash({
        renderer: rendererFloatingVue(),
      }),
    ],
  })
}

describe('vitepress-twoslash @errors directives on incomplete code', () => {
  it('still highlights a hover query', async () => {
    const html = hastToHtml(await highlight(goodCase))
    expect(html).toContain('twoslash')
  })

  for (const [name, code] of Object.entries(relatedCases)) {
    it(`does not crash (${name})`, async () => {
      const html = hastToHtml(await highlight(code))
      expect(html).toContain('twoslash-error')
    })
  }

  it('renders the official handbook @errors: 1005 snippet', async () => {
    const html = hastToHtml(await highlight(officialRepro))
    expect(html).toContain('\')\' expected.')
    expect(html).toContain('twoslash-error')
  })
})
