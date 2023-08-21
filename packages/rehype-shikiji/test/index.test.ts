import fs from 'node:fs/promises'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { expect, test } from 'vitest'
import rehypeShikiji from '../src'

test('run', async () => {
  const file = await unified()
    // @ts-expect-error hast version mismatch
    .use(remarkParse)
    // @ts-expect-error hast version mismatch
    .use(remarkRehype)
    .use(rehypeShikiji, {
      theme: 'vitesse-light',
    })
    // @ts-expect-error hast version mismatch
    .use(rehypeStringify)
    .process(await fs.readFile(new URL('./fixtures/a.md', import.meta.url)))

  expect(file.toString()).toMatchFileSnapshot('./fixtures/a.out.html')
})
