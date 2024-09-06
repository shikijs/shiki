import fs from 'node:fs/promises'
import { transformerMetaHighlight } from '@shikijs/transformers'
import MarkdownIt from 'markdown-it'
import { expect, it } from 'vitest'
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
}, { timeout: 10_000 })

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
}, { timeout: 10_000 })

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
}, { timeout: 10_000 })
