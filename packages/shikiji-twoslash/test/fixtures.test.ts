import { codeToHtml } from 'shikiji'
import { rendererRich, transformerTwoSlash } from 'shikiji-twoslash'
import { describe, expect, it } from 'vitest'

const files = import.meta.glob('./fixtures/*.*', { as: 'raw', eager: true })

describe('fixtures', () => {
  for (const file in files) {
    it('should works', async () => {
      const code = files[file]
      const ext = file.split('.').pop()!
      const html = await codeToHtml(code, {
        lang: ext,
        theme: 'vitesse-dark',
        transformers: [
          transformerTwoSlash({
            renderer: rendererRich(),
          }),
        ],
      })

      const style = '<link rel="stylesheet" href="../../../style-rich.css" />'
      expect(style + html).toMatchFileSnapshot(`./out/${file}.html`)
    })
  }
})
