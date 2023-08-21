import fs from 'node:fs/promises'
import { join } from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { expect, test } from 'vitest'
import rehypeShikiji from '../src'

test('run', async () => {
  const __dirname = new URL('.', import.meta.url).pathname
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
    .process(await fs.readFile(join(__dirname, './fixtures/a.md')))

  expect(file.toString()).toMatchFileSnapshot('./fixtures/a.out.html')
})
