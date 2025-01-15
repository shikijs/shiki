import { basename } from 'node:path'
import { transformerTwoslash } from '@shikijs/twoslash'
import { codeToHast, getSingletonHighlighter } from 'shiki'
import { describe, expect, it } from 'vitest'
import { rendererFloatingVue } from '../src'

const files = import.meta.glob<string>('../../twoslash/test/fixtures/*.*', { query: '?raw', import: 'default', eager: true })

describe('fixtures', async () => {
  const shiki = await getSingletonHighlighter()
  shiki.loadLanguage('js')

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
            renderer: rendererFloatingVue(),
          }),
        ],
      })

      await expect.soft(JSON.stringify(hast, null, 2))
        .toMatchFileSnapshot(`./out/${name}.json`)
    })
  }
})
