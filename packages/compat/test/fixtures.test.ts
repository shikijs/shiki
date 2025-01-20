/// <reference types="vite/client" />

import { extname } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import getHighlighter from '../src'

describe('fixtures', () => {
  const files = import.meta.glob<string>('./input/*.*', { query: '?raw', import: 'default', eager: true })
  const filter = process.env.FILTER
  Object
    .entries(files)
    .forEach(([path, content]) => {
      const run = !filter || path.includes(filter)
        ? it
        : it.skip

      run(`render ${path}`, async () => {
        const shiki = await getHighlighter({
          theme: 'nord',
          langs: ['javascript'],
        })

        const code = await shiki.codeToHtml(content, {
          lang: extname(path).slice(1) as any,
          lineOptions: [
            { line: 2, classes: ['test'] },
          ],
        })

        const code2 = await shiki.codeToHtml(content, extname(path).slice(1), undefined, {
          lineOptions: [
            { line: 2, classes: ['test'] },
          ],
        })

        await expect(code)
          .toMatchFileSnapshot(path.replace('input', 'output').replace(/\.\w+$/, '.html'))

        expect(code).toBe(code2)
      })
    })
})
