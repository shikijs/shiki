import { codeToHtml, codeToTokensBase } from 'shiki'
import { transformerTwoslash } from '@shikijs/twoslash'
import { expect, it } from 'vitest'

const code = `const x: [number] = ["hello"]`

it('verify theme behavior', async () => {
  const tokens = await codeToTokensBase(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
  })

  // `vitesse-dark` separates the the quotes ints tokens, where the error is targeting all strings
  expect
    .soft(tokens.find(i => i.find(j => j.content === '"')))
    .toBeDefined()
  expect
    .soft(tokens.find(i => i.find(j => j.content === '"ref"')))
    .not
    .toBeDefined()
})

it('should split tokens correctly', async () => {
  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerTwoslash({
        twoslashOptions: {
          handbookOptions: {
            errors: [2322],
          },
        },
      }),
    ],
  })

  expect(
    `<link rel="stylesheet" href="../../style-rich.css" />\n${html}`,
  )
    .toMatchFileSnapshot('./out/error-multi-tokens.html')
})
