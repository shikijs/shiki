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

By default, the full bundle of `shikiji` will be imported. If you are using a [fine-grained bundle](/guide/install#fine-grained-bundle), you can import `rehypeShikijiFromHighlighter` from `rehype-shikiji/core` and pass your own highlighter:

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

In addition to the features of `shikiji`, this plugin also supports line highlighting. You can specify line numbers to highlight after the language name in the format `{<line-numbers>}` - a comma separated list of `<line-number>`s, wrapped in curly braces. Each line number can be a single number (e.g. `{2}` highlights line 2 and `{1,4}` highlights lines 1 and 4) or a range (e.g. `{5-7}` highlights lines 1 through 7, and `{1-3,5-6}` highlights lines 1 through 3 and 5 through 6). For example:

````md
```js {1,3-4}
console.log('1') // highlighted
console.log('2')
console.log('3') // highlighted
console.log('4') // highlighted
```
````
