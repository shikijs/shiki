import { basename } from 'node:path'
import { codeToHast } from 'shikiji'
import { transformerTwoslash } from 'shikiji-twoslash'
import { describe, expect, it } from 'vitest'
import { rendererFloatingVue } from '../src'

const files = import.meta.glob('../../shikiji-twoslash/test/fixtures/*.*', { as: 'raw', eager: true })

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
            renderer: rendererFloatingVue(),
          }),
        ],
      })

      expect.soft(JSON.stringify(hast, null, 2))
        .toMatchFileSnapshot(`./out/${name}.json`)
    })
  }
})
