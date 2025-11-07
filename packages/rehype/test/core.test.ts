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

it('preserves hast element data and properties', async () => {
  const highlighter = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['javascript'],
  })

  // Create a tree with pre/code elements that have custom data and properties
  const tree: Root = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {
          customProp: 'preValue',
          id: 'my-pre',
        },
        data: {
          customData: 'preData',
        } as any,
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {
              className: ['language-javascript'],
              customCodeProp: 'codeValue',
            },
            data: {
              meta: 'fileName="hello.js"',
              customCodeData: 'codeData',
            } as any,
            children: [
              {
                type: 'text',
                value: 'console.log("hello")',
              },
            ],
          },
        ],
      },
    ],
  }

  const result = await unified()
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: 'vitesse-light',
    })
    .run(tree)

  // The rehype plugin replaces the pre node with a fragment (Root)
  // So result.children[0] is the fragment, and fragment.children[0] is the pre
  const fragment = result.children[0] as unknown as Root
  const preElement = fragment.children[0]

  expect(preElement).toBeDefined()
  expect(preElement.type).toBe('element')

  if (preElement.type === 'element') {
    expect(preElement.tagName).toBe('pre')
    expect(preElement.properties?.customProp).toBe('preValue')
    expect(preElement.properties?.id).toBe('my-pre')
    expect((preElement.data as any)?.customData).toBe('preData')

    // Check that the code element preserved custom properties and data
    const codeElement = preElement.children[0]
    expect(codeElement).toBeDefined()
    expect(codeElement.type).toBe('element')
    if (codeElement.type === 'element') {
      expect(codeElement.tagName).toBe('code')
      expect(codeElement.properties?.customCodeProp).toBe('codeValue')
      expect((codeElement.data as any)?.customCodeData).toBe('codeData')
      expect(codeElement.data?.meta).toBe('fileName="hello.js"')
    }
  }
})
