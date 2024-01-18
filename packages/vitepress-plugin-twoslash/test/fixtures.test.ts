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
      const code = files[file]
      const ext = file.split('.').pop()!
      const hast = await codeToHast(code, {
        lang: ext,
        theme: 'vitesse-dark',
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
