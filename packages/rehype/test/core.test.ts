import type { Root } from 'hast'
import fs from 'node:fs/promises'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createHighlighter } from 'shiki'
import { unified } from 'unified'

import { visit } from 'unist-util-visit'
import { expect, it } from 'vitest'
import { transformerMetaHighlight } from '../../transformers/src'
import rehypeShikiFromHighlighter from '../src/core'

it('run', async () => {
  const highlighter = await createHighlighter({
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
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: 'vitesse-light',
      defaultLanguage: 'text',
      transformers: [
        transformerMetaHighlight(),
      ],
    })
    .use(rehypeStringify)
    .processSync(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/a.core.out.html')
})

it('run with lazy', async () => {
  const highlighter = await createHighlighter({
    themes: [
      'vitesse-light',
    ],
    langs: [],
  })

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiFromHighlighter, highlighter, {
      lazy: true,
      theme: 'vitesse-light',
      defaultLanguage: 'text',
      transformers: [
        transformerMetaHighlight(),
      ],
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/a.core.out.html')
})

it('run with rehype-raw', async () => {
  const highlighter = await createHighlighter({
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
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: 'vitesse-light',
      defaultLanguage: 'text',
      transformers: [
        transformerMetaHighlight(),
      ],
    })
    .use(rehypeStringify)
    .processSync(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/a.core.out.html')
})

it('run with lazy + fallback language', async () => {
  const highlighter = await createHighlighter({
    themes: [
      'vitesse-light',
    ],
    langs: [],
  })

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiFromHighlighter, highlighter, {
      lazy: true,
      theme: 'vitesse-light',
      defaultLanguage: 'text',
      fallbackLanguage: 'text',
      langs: [],
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/d.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/d.out.html')
})
