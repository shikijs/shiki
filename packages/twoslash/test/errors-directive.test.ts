import type { TwoslashRenderer } from '../src/types'
import { rendererClassic, rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import { codeToHast, hastToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'

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

async function highlight(code: string, renderer: TwoslashRenderer) {
  return codeToHast(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerTwoslash({ renderer }),
    ],
  })
}

describe('twoslash @errors directives on incomplete code', () => {
  it('still highlights a hover query', async () => {
    const hast = await highlight(goodCase, rendererRich())
    expect(hastToHtml(hast)).toContain('twoslash')
  })

  for (const [name, code] of Object.entries(relatedCases)) {
    it(`does not crash with rendererRich (${name})`, async () => {
      const hast = await highlight(code, rendererRich())
      const html = hastToHtml(hast)
      expect(html).toContain('twoslash-error')
    })

    it(`does not crash with rendererRich hover errors (${name})`, async () => {
      const hast = await highlight(code, rendererRich({ errorRendering: 'hover' }))
      expect(hastToHtml(hast)).toContain('twoslash-error')
    })

    it(`does not crash with rendererClassic (${name})`, async () => {
      const hast = await highlight(code, rendererClassic())
      expect(hastToHtml(hast)).toMatch(/error|data-err/)
    })
  }

  it('renders the official handbook @errors: 1005 snippet', async () => {
    const html = hastToHtml(await highlight(officialRepro, rendererRich()))
    expect(html).toContain('\')\' expected.')
    expect(html).toContain('twoslash-error')
  })
})
