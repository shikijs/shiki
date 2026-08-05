import type { Root } from 'hast'
import fs from 'node:fs/promises'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createHighlighter } from 'shiki'

import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { expect, it, vi } from 'vitest'
import { transformerMetaHighlight } from '../../transformers/src'
import rehypeShikiFromHighlighter from '../src/core'

it('run', async () => {
  using highlighter = await createHighlighter({
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
  using highlighter = await createHighlighter({
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
  using highlighter = await createHighlighter({
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
  using highlighter = await createHighlighter({
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

it('lazy loading error handling with fallbackLanguage', async () => {
  using highlighter = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['text'],
  })

  // Create a mock highlighter that fails to load a specific language
  const mockHighlighter = {
    ...highlighter,
    loadLanguage: async (...langs: Parameters<typeof highlighter.loadLanguage>) => {
      const lang = langs[0] as string
      if (lang === 'nonexistent-lang') {
        throw new Error(`Language 'nonexistent-lang' not found`)
      }
      return highlighter.loadLanguage(...langs)
    },
  }

  const markdown = '```nonexistent-lang\nconst x = 1\n```'

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiFromHighlighter, mockHighlighter, {
      lazy: true,
      theme: 'vitesse-light',
      fallbackLanguage: 'text',
    })
    .use(rehypeStringify)
    .process(markdown)

  // Should use fallback language (text) instead of throwing
  expect(file.toString()).toContain('<pre')
  expect(file.toString()).toContain('<code')
})

it('lazy loading error handling with onError callback', async () => {
  using highlighter = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['text'],
  })

  const errors: unknown[] = []
  const onError = (error: unknown) => {
    errors.push(error)
  }

  // Create a mock highlighter that fails to load a specific language
  const mockHighlighter = {
    ...highlighter,
    loadLanguage: async (...langs: Parameters<typeof highlighter.loadLanguage>) => {
      const lang = langs[0] as string
      if (lang === 'failing-lang') {
        throw new Error(`Language 'failing-lang' not found`)
      }
      return highlighter.loadLanguage(...langs)
    },
  }

  const markdown = '```failing-lang\nconst x = 1\n```'

  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiFromHighlighter, mockHighlighter, {
      lazy: true,
      theme: 'vitesse-light',
      onError,
    })
    .use(rehypeStringify)
    .process(markdown)

  // onError should be called
  expect(errors.length).toBeGreaterThan(0)
  expect(errors[0]).toBeInstanceOf(Error)
})

it('onFallback with lazy sync error', async () => {
  using highlighter = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['text'],
  })

  const mockHighlighter = {
    ...highlighter,
    loadLanguage: (...langs: Parameters<typeof highlighter.loadLanguage>) => {
      const lang = langs[0] as string
      if (lang === 'sync-fail-lang')
        throw new Error(`Language 'sync-fail-lang' not found`)
      return highlighter.loadLanguage(...langs)
    },
  }

  const onFallback = vi.fn()
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiFromHighlighter, mockHighlighter, {
      lazy: true,
      theme: 'vitesse-light',
      fallbackLanguage: 'text',
      onFallback,
    })
    .use(rehypeStringify)
    .process('```sync-fail-lang\nconst x = 1\n```')

  expect(onFallback).toHaveBeenCalledWith({
    requestedLanguage: 'sync-fail-lang',
    fallbackLanguage: 'text',
  })
  expect(file.toString()).toContain('<pre')
})

it('onFallback with lazy async error', async () => {
  using highlighter = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['text'],
  })

  const mockHighlighter = {
    ...highlighter,
    loadLanguage: async (...langs: Parameters<typeof highlighter.loadLanguage>) => {
      const lang = langs[0] as string
      if (lang === 'unknown-lang')
        throw new Error(`Language 'unknown-lang' not found`)
      return highlighter.loadLanguage(...langs)
    },
  }

  const onFallback = vi.fn()
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiFromHighlighter, mockHighlighter, {
      lazy: true,
      theme: 'vitesse-light',
      fallbackLanguage: 'text',
      onFallback,
    })
    .use(rehypeStringify)
    .process('```unknown-lang\nconst x = 1\n```')

  expect(onFallback).toHaveBeenCalledWith({
    requestedLanguage: 'unknown-lang',
    fallbackLanguage: 'text',
  })
  expect(file.toString()).toContain('<pre')
})

it('onFallback with non-lazy fallback', async () => {
  using highlighter = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['javascript'],
  })

  const onFallback = vi.fn()
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: 'vitesse-light',
      fallbackLanguage: 'javascript',
      onFallback,
    })
    .use(rehypeStringify)
    .process('```python\nprint("hello")\n```')

  expect(onFallback).toHaveBeenCalledWith({
    requestedLanguage: 'python',
    fallbackLanguage: 'javascript',
  })
  expect(file.toString()).toContain('<pre')
})

it('lazy loading error handling throws when no fallback or onError', async () => {
  using highlighter = await createHighlighter({
    themes: ['vitesse-light'],
    langs: ['text'],
  })

  // Create a mock highlighter that fails to load a specific language
  const mockHighlighter = {
    ...highlighter,
    loadLanguage: async (...langs: Parameters<typeof highlighter.loadLanguage>) => {
      const lang = langs[0] as string
      if (lang === 'error-lang') {
        throw new Error(`Language 'error-lang' not found`)
      }
      return highlighter.loadLanguage(...langs)
    },
  }

  const markdown = '```error-lang\nconst x = 1\n```'

  await expect(
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeShikiFromHighlighter, mockHighlighter, {
        lazy: true,
        theme: 'vitesse-light',
      })
      .use(rehypeStringify)
      .process(markdown),
  ).rejects.toThrow()
})
