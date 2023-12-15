# markdown-it-shikiji

<Badges name="markdown-it-shikiji" />

[Markdown It](https://markdown-it.github.io/) plugin for Shikiji.

## Install

```bash
npm i -D markdown-it-shikiji
```

## Usage

```ts
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

By default, the full bundle of `shikiji` will be imported. If you are Shikiji's [fine-grained bundle](/guide/#fine-grained-bundle), you can import from `markdown-it-shikiji/core` and pass your own highlighter:

```ts
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

````

```

## License

MIT
```
````
