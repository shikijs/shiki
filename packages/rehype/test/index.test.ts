import fs from 'node:fs/promises'
import { transformerMetaHighlight, transformerMetaWordHighlight } from '@shikijs/transformers'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { expect, it } from 'vitest'
import rehypeShiki from '../src'

const RE_NORMAL_KEY = /^[A-Z0-9]+$/i
const RE_LINE_CLASS = /class="line"/g

it('lang-alias', async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      addLanguageClass: true,
      langAlias: {
        mylang: 'javascript',
        mylang2: 'js', // nested alias
      },
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/lang-alias.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/lang-alias.out.html')
})

it('run', async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      defaultLanguage: 'text',
      transformers: [
        transformerMetaWordHighlight(),
        transformerMetaHighlight(),
      ],
      parseMetaString: (str) => {
        return Object.fromEntries(str.split(' ').reduce((prev: [string, boolean | string][], curr: string) => {
          const [key, value] = curr.split('=')
          const isNormalKey = RE_NORMAL_KEY.test(key)
          if (isNormalKey) {
            prev = [
              ...prev,
              [key, value || true],
            ]
          }
          return prev
        }, []))
      },
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/a.out.html')
})

it('code-add-language-class', async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      addLanguageClass: true,
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/b.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/b.out.html')
})

it('add-custom-cache', async () => {
  const cache = new Map()
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      addLanguageClass: true,
      cache,
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/c.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/c.out.html')
})

it('shiki inline code', async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      inline: 'tailing-curly-colon',
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/inline.md', import.meta.url)))

  await expect(file.toString()).toMatchFileSnapshot('./fixtures/inline.out.html')
})

it('does not add extra trailing blank line', async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      defaultLanguage: 'text',
    })
    .use(rehypeStringify)
    .process('```\nthis should only have one .line\n```')

  const lineCount = file.toString().match(RE_LINE_CLASS)?.length ?? 0
  expect(lineCount).toEqual(1)
})
