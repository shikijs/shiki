import fs from 'node:fs/promises'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { expect, it } from 'vitest'

import { getHighlighter } from 'shikiji'
import type { Root } from 'hast'
import rehypeShikijiFromHighlighter from '../src/core'

it('run', async () => {
  const highlighter = await getHighlighter({
    themes: [
      'vitesse-light',
    ],
    langs: [
      'javascript',
    ],
  })

  const file = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikijiFromHighlighter, highlighter, {
      theme: 'vitesse-light',
      highlightLines: true,
    })
    .use(rehypeStringify)
    .processSync(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  expect(file.toString()).toMatchFileSnapshot('./fixtures/a.core.out.html')
})

it('run with rehype-raw', async () => {
  const highlighter = await getHighlighter({
    themes: [
      'vitesse-light',
    ],
    langs: [
      'javascript',
    ],
  })

  const rehypeMetaString = () => (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'code' && node.data?.meta) {
        node.properties ??= {}
        node.properties.metastring = node.data.meta
      }
    })
  }

  const file = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMetaString)
    .use(rehypeRaw)
    .use(rehypeShikijiFromHighlighter, highlighter, {
      theme: 'vitesse-light',
      highlightLines: true,
    })
    .use(rehypeStringify)
    .processSync(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  expect(file.toString()).toMatchFileSnapshot('./fixtures/a.core.out.html')
})
