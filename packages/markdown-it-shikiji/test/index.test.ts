import fs from 'node:fs/promises'
import { expect, test } from 'vitest'
import MarkdownIt from 'markdown-it'
import Shikiji from '../src'

test('run', async () => {
  const md = MarkdownIt()
  md.use(await Shikiji({
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  }))

  const result = md.render(await fs.readFile(new URL('./fixtures/a.md', import.meta.url), 'utf-8'))

  expect(result).toMatchFileSnapshot('./fixtures/a.out.html')
})
