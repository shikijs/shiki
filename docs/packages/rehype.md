---
outline: deep
---

# rehype-shikiji

<Badges name="rehype-shikiji" />

[rehype](https://github.com/rehypejs/rehype) plugin for Shikiji.

## Install

```bash
npm i -D rehype-shikiji
```

## Usage

```ts twoslash
// @noErrors: true
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiji from 'rehype-shikiji'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikiji, {
    // or `theme` for a single theme
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .process(await fs.readFile('./input.md'))
```

## Fine-grained Bundle

By default, the full bundle of `shikiji` will be imported. If you are Shikiji's [fine-grained bundle](/guide/install#fine-grained-bundle), you can import `rehypeShikijiFromHighlighter` from `rehype-shikiji/core` and pass your own highlighter:

```ts twoslash
// @noErrors: true
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShikijiFromHighlighter from 'rehype-shikiji/core'

import { fromHighlighter } from 'markdown-it-shikiji/core'
import { getHighlighterCore } from 'shikiji/core'
import { getWasmInlined } from 'shikiji/wasm'

const highlighter = await getHighlighterCore({
  themes: [
    import('shikiji/themes/vitesse-light.mjs')
  ],
  langs: [
    import('shikiji/langs/javascript.mjs'),
  ],
  loadWasm: getWasmInlined
})

const raw = await fs.readFile('./input.md')
const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikijiFromHighlighter, highlighter, {
    // or `theme` for a single theme
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .processSync(raw) // it's also possible to process synchronously
```

## Features

### Line Highlight

In addition to the features of `shikiji`, this plugin also supports line highlighting. You can add `{1,3-4}` after the language name to highlight the specified lines. For example:

````md
# Hello World

```js {1,3-4}
console.log('line1') // highlighted
console.log('line2')
console.log('line3') // highlighted
console.log('line4') // highlighted
```
````
