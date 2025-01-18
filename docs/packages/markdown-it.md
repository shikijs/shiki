# @shikijs/markdown-it

<Badges name="@shikijs/markdown-it" />

[markdown-it](https://markdown-it.github.io/) plugin for Shiki.

## Install

```bash
npm i -D @shikijs/markdown-it
```

## Usage

```ts twoslash
import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

md.use(await Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))
```

## Fine-grained Bundle

By default, the full bundle of `shiki` will be imported. If you are using a [fine-grained bundle](/guide/bundles#fine-grained-bundle), you can import from `@shikijs/markdown-it/core` and pass your own highlighter:

```ts twoslash
// @noErrors: true
import { fromHighlighter } from '@shikijs/markdown-it/core'
import MarkdownIt from 'markdown-it'
import { createHighlighterCore } from 'shiki/core'

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/vitesse-light')
  ],
  langs: [
    import('@shikijs/langs/javascript'),
  ],
  loadWasm: import('shiki/wasm')
})

const md = MarkdownIt()

md.use(fromHighlighter(highlighter, { /* options */ }))
```
