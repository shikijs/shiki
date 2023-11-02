import fs from 'node:fs/promises'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { expect, it } from 'vitest'
import rehypeShikiji from '../src'

it('run', async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShikiji, {
      theme: 'vitesse-light',
      parseMetaString: (str) => {
        return Object.fromEntries(str.split(' ').reduce((prev: [string, boolean | string][], curr: string) => {
          const [key, value] = curr.split('=')
          const isNormalKey = /^[A-Za-z0-9]+$/.test(key)
          if (isNormalKey)
            prev = [...prev, [key, value || true]]
          return prev
        }, []))
      },
    })
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  expect(file.toString()).toMatchFileSnapshot('./fixtures/a.out.html')
})
