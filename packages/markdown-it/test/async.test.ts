import fs from 'node:fs/promises'
import MarkdownIt from 'markdown-it-ts'
import { codeToHtml } from 'shiki'
import { expect, it } from 'vitest'
import { fromAsyncCodeToHtml } from '../src/async'

it('async', { timeout: 10_000 }, async () => {
  const md = MarkdownIt()
  md.use(fromAsyncCodeToHtml(codeToHtml, {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  }))

  const result = await md.renderAsync(await fs.readFile(new URL('./fixtures/a.md', import.meta.url), 'utf-8'))

  await expect(result).toMatchFileSnapshot('./fixtures/a.async.out.html')
})
