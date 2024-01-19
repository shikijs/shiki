import { basename } from 'node:path'
import { codeToHast, hastToHtml } from 'shikiji'
import { rendererRich, transformerTwoslash } from 'shikiji-twoslash'
import { describe, expect, it } from 'vitest'

const files = import.meta.glob('./fixtures/*.*', { as: 'raw', eager: true })

describe('fixtures', () => {
  for (const file in files) {
    const name = basename(file)
    it(name, async () => {
      let code = files[file]
      const ext = file.split('.').pop()!

      let theme = 'vitesse-dark'
      code = code.replace(/\/\/\s+@theme:\s+(.*)\n/, (_, t) => {
        theme = t
        return ''
      })

      const hast = await codeToHast(code, {
        lang: ext,
        theme,
        transformers: [
          transformerTwoslash({
            renderer: rendererRich(),
          }),
        ],
      })

      const html = hastToHtml(hast)

      expect.soft(JSON.stringify(hast, null, 2))
        .toMatchFileSnapshot(`./out/${name}.json`)

      const style = '<link rel="stylesheet" href="../../style-rich.css" />'
      expect.soft(style + html)
        .toMatchFileSnapshot(`./out/${name}.html`)
    })
  }
})
