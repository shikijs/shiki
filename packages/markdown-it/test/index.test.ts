import fs from 'node:fs/promises'
import { expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import { transformerMetaHighlight } from '@shikijs/transformers'
import Shiki from '../src'

it('run for base', async () => {
  const md = MarkdownIt()
  md.use(await Shiki({
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    transformers: [
      transformerMetaHighlight(),
    ],
  }))

  const result = md.render(await fs.readFile(new URL('./fixtures/a.md', import.meta.url), 'utf-8'))

  expect(result).toMatchFileSnapshot('./fixtures/a.out.html')
})
it('run for fallback language', async () => {
  const md = MarkdownIt()
  md.use(await Shiki({
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    fallbackLanguage: 'js',
    transformers: [
      transformerMetaHighlight(),
    ],
  }))

  const result = md.render(await fs.readFile(new URL('./fixtures/b.md', import.meta.url), 'utf-8'))

  expect(result).toMatchFileSnapshot('./fixtures/b.out.html')
})
it('run for default language', async () => {
  const md = MarkdownIt()
  md.use(await Shiki({
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    defaultLanguage: 'js',
    transformers: [
      transformerMetaHighlight(),
    ],
  }))

  const result = md.render(await fs.readFile(new URL('./fixtures/c.md', import.meta.url), 'utf-8'))

  expect(result).toMatchFileSnapshot('./fixtures/c.out.html')
})
