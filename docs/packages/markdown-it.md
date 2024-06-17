# @shikijs/markdown-it

<Badges name="@shikijs/markdown-it" />

[markdown-it](https://markdown-it.github.io/) plugin for Shiki.

## Install

```bash
npm i -D @shikijs/markdown-it
```

## Usage

```ts twoslash
import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md = MarkdownIt()

md.use(await Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))
```

## Fine-grained Bundle

By default, the full bundle of `shiki` will be imported. If you are using a [fine-grained bundle](/guide/install#fine-grained-bundle), you can import from `@shikijs/markdown-it/core` and pass your own highlighter:

```ts twoslash
// @noErrors: true
import MarkdownIt from 'markdown-it'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'

const highlighter = await createHighlighterCore({
  themes: [
    import('shiki/themes/vitesse-light.mjs')
  ],
  langs: [
    import('shiki/langs/javascript.mjs'),
  ],
  loadWasm: import('shiki/wasm')
})

const md = MarkdownIt()

md.use(fromHighlighter(highlighter, { /* options */ }))
```

## Features

### Line Highlight

::: warning
This is deprecated. It's disabled by default in `v0.10.0` and will be removed in the next minor. Consider use [`transformerNotationHighlight`](https://shiki.style/packages/transformers#transformernotationhighlight) instead.
:::

In addition to the features of `shiki`, this plugin also supports line highlighting. You can specify line numbers to highlight after the language name in the format `{<line-numbers>}` - a comma separated list of `<line-number>`s, wrapped in curly braces. Each line number can be a single number (e.g. `{2}` highlights line 2 and `{1,4}` highlights lines 1 and 4) or a range (e.g. `{5-7}` highlights lines 1 through 7, and `{1-3,5-6}` highlights lines 1 through 3 and 5 through 6). For example:

````md
```js {1,3-4}
console.log('1') // highlighted
console.log('2')
console.log('3') // highlighted
console.log('4') // highlighted
```
````

::: info
If line highlighting is not working, it may be due to compatibility issues with the [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) plugin. The syntax of `markdown-it-attrs` uses the same curly brace (`{}`) syntax that this plugin uses, which causes line highlighting to not work. If you wish to continue using `markdown-it-attrs` alongside this plugin, consider [changing the delimiter/syntax](https://github.com/arve0/markdown-it-attrs#custom-delimiters) of `markdown-it-attrs` to use a different character, such as `%`.
:::
