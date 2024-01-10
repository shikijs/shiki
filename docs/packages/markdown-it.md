# markdown-it-shikiji

<Badges name="markdown-it-shikiji" />

[Markdown It](https://markdown-it.github.io/) plugin for Shikiji.

## Install

```bash
npm i -D markdown-it-shikiji
```

## Usage

```ts twoslash
import MarkdownIt from 'markdown-it'
import Shikiji from 'markdown-it-shikiji'

const md = MarkdownIt()

md.use(await Shikiji({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))
```

## Fine-grained Bundle

By default, the full bundle of `shikiji` will be imported. If you are using a [fine-grained bundle](/guide/install#fine-grained-bundle), you can import from `markdown-it-shikiji/core` and pass your own highlighter:

```ts twoslash
// @noErrors: true
import MarkdownIt from 'markdown-it'
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

const md = MarkdownIt()

md.use(fromHighlighter(highlighter, { /* options */ }))
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
