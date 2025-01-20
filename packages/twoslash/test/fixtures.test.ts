import { basename } from 'node:path'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import { codeToHast, hastToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'

const files = import.meta.glob<string>('./fixtures/*.*', { query: '?raw', import: 'default', eager: true })

describe('fixtures', () => {
  for (const file in files) {
    const name = basename(file)
    it(name, async () => {
      let code = files[file]
      const ext = file.split('.').pop()!

      let theme = 'vitesse-dark'
      code = code.replace(/\/\/\s+@theme:\s+(\S*)\n/, (_, t) => {
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

      await expect
        .soft(JSON.stringify(hast, null, 2))
        .toMatchFileSnapshot(`./out/${name}.json`)

      const style = '<link rel="stylesheet" href="../../style-rich.css" />'
      await expect
        .soft(style + html)
        .toMatchFileSnapshot(`./out/${name}.html`)
    })
  }
})
