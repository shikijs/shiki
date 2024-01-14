import { codeToHtml, codeToThemedTokens } from 'shikiji'
import { transformerTwoSlash } from 'shikiji-twoslash'
import { expect, it } from 'vitest'

const code = `const x: [number] = ["hello"]`

it('verify theme behavior', async () => {
  const tokens = await codeToThemedTokens(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
  })

  // `vitesse-dark` separates the the quotes ints tokens, where the error is targeting all strings
  expect.soft(tokens.find(i => i.find(j => j.content === '"')))
    .toBeDefined()
  expect.soft(tokens.find(i => i.find(j => j.content === '"ref"')))
    .not.toBeDefined()
})

it('should split tokens correctly', async () => {
  const html = await codeToHtml(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerTwoSlash({
        twoslashOptions: {
          handbookOptions: {
            errors: [2322],
          },
        },
      }),
    ],
  })

  expect.soft(
    [...html.matchAll(/<span class="twoslash-error">(.*?)<\/span>/g)].map(i => i[1]),
  )
    .toEqual(['"', 'hello', '"'])

  expect(
    `<link rel="stylesheet" href="../../style-rich.css" />\n${html}`,
  )
    .toMatchFileSnapshot('./out/error-multi-tokens.html')
})
