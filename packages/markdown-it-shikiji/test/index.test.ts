import fs from 'node:fs/promises'
import { expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import Shikiji from '../src'

it('run', async () => {
  const md = MarkdownIt()
  md.use(await Shikiji({
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    highlightLines: true,
  }))

  const result = md.render(await fs.readFile(new URL('./fixtures/a.md', import.meta.url), 'utf-8'))

  expect(result).toMatchFileSnapshot('./fixtures/a.out.html')
})
