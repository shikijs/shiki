import fs from 'node:fs/promises'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { expect, it } from 'vitest'

import { getHighlighter } from 'shikiji'
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
