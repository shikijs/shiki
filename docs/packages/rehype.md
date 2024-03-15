---
outline: deep
---

# @shikijs/rehype

<Badges name="@shikijs/rehype" />

[rehype](https://github.com/rehypejs/rehype) plugin for Shiki.

## Install

```bash
npm i -D @shikijs/rehype
```

## Usage

```ts twoslash
// @noErrors: true
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShiki from '@shikijs/rehype'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShiki, {
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

By default, the full bundle of `shiki` will be imported. If you are using a [fine-grained bundle](/guide/install#fine-grained-bundle), you can import `rehypeShikiFromHighlighter` from `@shikijs/rehype/core` and pass your own highlighter:

```ts twoslash
// @noErrors: true
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'

import { getHighlighterCore } from 'shiki/core'

const highlighter = await getHighlighterCore({
  themes: [
    import('shiki/themes/vitesse-light.mjs')
  ],
  langs: [
    import('shiki/langs/javascript.mjs'),
  ],
  loadWasm: import('shiki/wasm')
})

const raw = await fs.readFile('./input.md')
const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikiFromHighlighter, highlighter, {
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

::: warning
This is deprecated. It's disabled by default in `v0.10.0` and will be removed in the next minor. Consider use [`transformerNotationHighlight`](https://shiki.style/packages/transformers#transformernotationhighlight) instead.
:::

In addition to the features of `shiki`, this plugin also supports line highlighting. You can specify line numbers to highlight after the language name in the format `{<line-numbers>}` - a comma separated list of `<line-number>`s, wrapped in curly braces. Each line number can be a single number (e.g. `{2}` highlights line 2 and `{1,4}` highlights lines 1 and 4) or a range (e.g. `{1-7}` highlights lines 1 through 7, and `{1-3,5-6}` highlights lines 1 through 3 and 5 through 6). For example:

````md
```js {1,3-4}
console.log('1') // highlighted
console.log('2')
console.log('3') // highlighted
console.log('4') // highlighted
```
````
