---
outline: deep
---

# Getting Started

## Introduction

<span text-xl text-amber5>
<b>Shikiji</b> <ruby>式<rt>shiki</rt></ruby><ruby>辞<rt>ji</rt></ruby>
</span> is a beautiful syntax highlighter based on TextMate grammar and themes, the same engine as VS Code's syntax highlighting. Provides a very accurate and fast syntax highlighting for almost any mainstream programming language.

No custom RegEx to maintain, no custom CSS to maintain, no custom HTML to maintain. And as your favorite languages and themes in VS Code evolve - your syntax highlighting will evolve too.

Shikiji is a ESM-rewrite of [Shiki](https://github.com/shikijs/shiki) with quite many improvements. We aim to [merge this project back to Shiki as a milestone update](https://github.com/shikijs/shiki/issues/510).

About the name, <ruby text-lg text-amber5>式<rt>shiki</rt></ruby><ruby text-lg text-amber5>辞<rt>ji</rt></ruby> is a Japanese word meaing ["Ceremonial Speech"](https://jisho.org/word/%E5%BC%8F%E8%BE%9E). <ruby text-amber5 text-lg>式<rt>shiki</rt></ruby> is inherited from [shiki](https://github.com/shikijs/shiki) means ["Style"](https://jisho.org/word/%E5%BC%8F) and <ruby text-amber5 text-lg>辞<rt>ji</rt></ruby> means ["Word"](https://jisho.org/word/%E8%BE%9E).

Oh btw, the code blocks in this document is highlighted by Shikiji, as you'd expect \:)

## Features

- All grammars/themes/wasm served as pure-ESM, no more [CDN](https://github.com/shikijs/shiki#specify-a-custom-root-directory), no more [assets](https://github.com/shikijs/shiki#specify-how-to-load-webassembly).
- Portable. Does not rely on Node.js APIs or the filesystem, works in any modern JavaScript runtime.
- ESM-only ([CDN Usage](#cdn-usage), [CJS Usage](#cjs-usage))
- [Bundles languages/themes composedly](#fine-grained-bundle)
- [Light/Dark themes support](/guide/dual-themes)
- [AST-based transformers addons](/guide/transformers)
- [`hast` support](/guide/transformers#codetohast)
- [TypeScript TwoSlash](/packages/twoslash)
- [Shiki-compatible build](/guide/compat)

## Playground

Here is a little playground for you to try out how Shikiji highlights your code. Unlike other code blocks that ran on the build time, this playground is rendered on the client side in the browser. Themes and languages are loaded on demand.

<ShikijiMiniPlayground />

## Installation

::: code-group

```sh [npm]
npm install -D shikiji
```

```sh [yarn]
yarn add -D shikiji
```

```sh [yarn]
pnpm add -D shikiji
```

```sh [bun]
bun add -D shikiji
```

:::

## Integrations

We also provide some integrations like [Markdown It Plugin](/packages/markdown-it) and [Rehype Plugin](/packages/rehype). Learn more about them in the integrations section.

## Usage

### Bundled Usage

Basic usage is pretty much the same as `shiki`, only that some APIs are dropped, (for example, the singular `theme` options). While each theme and language file is a dynamically imported ES module, it would be better to list the languages and themes **explicitly** to have the best performance.

```ts twoslash
import { getHighlighter } from 'shikiji'

const highlighter = await getHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// optionally, load themes and languages after creation
await highlighter.loadTheme('vitesse-light')
await highlighter.loadLanguage('css')

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'vitesse-light'
})
```

Unlike `shiki`, `shikiji` does not load any themes or languages when not specified.

```ts theme:slack-dark twoslash
import { getHighlighter } from 'shikiji'

const highlighter = await getHighlighter()

highlighter.codeToHtml(
  'const a = 1',
  { lang: 'javascript', theme: 'slack-dark' }
)
// @error: Throw error, `javascript` is not loaded

await highlighter.loadLanguage('javascript') // load the language
```

If you want to load all themes and languages (not recommended), you can iterate all keys from `bundledLanguages` and `bundledThemes`.

```ts
import { bundledLanguages, bundledThemes, getHighlighter } from 'shikiji'

const highlighter = await getHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
})

highlighter.codeToHtml('const a = 1', { lang: 'javascript' })
```

Or if your usage can be async, you can try the [shorthands](/guide/shorthands) which will load the theme/language on demand.

### Fine-grained Bundle

When importing `shikiji`, all the themes and languages are bundled as async chunks. Normally it won't be a concern to you as they are not being loaded if you don't use them. In some cases, if you want to control what to bundle, you can use the core and compose your own bundle.

```js theme:material-theme-ocean
// `shikiji/core` entry does not include any themes or languages or the wasm binary.
import { getHighlighterCore } from 'shikiji/core'

// `shikiji/wasm` contains the wasm binary inlined as base64 string.
import { getWasmInlined } from 'shikiji/wasm'

// directly import the theme and language modules, only the ones you imported will be bundled.
import nord from 'shikiji/themes/nord.mjs'

const shiki = await getHighlighterCore({
  themes: [
    // instead of strings, you need to pass the imported module
    nord,
    // or a dynamic import if you want to do chunk splitting
    import('shikiji/themes/material-theme-ocean.mjs')
  ],
  langs: [
    import('shikiji/langs/javascript.mjs'),
    // shikiji will try to interop the module with the default export
    () => import('shikiji/langs/css.mjs'),
    // or a getter that returns custom grammar
    async () => JSON.parse(await fs.readFile('my-grammar.json', 'utf-8'))
  ],
  loadWasm: getWasmInlined
})

// optionally, load themes and languages after creation
await shiki.loadTheme(import('shikiji/themes/vitesse-light.mjs'))

const code = shiki.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'material-theme-ocean'
})
```

### CJS Usage

`shikiji` is published as ESM-only to reduce the package size. It's still possible to use it in CJS, as Node.js supports importing ESM modules dynamically in CJS.

For example, the following ESM code:

```js
// ESM
import { getHighlighter } from 'shikiji'

async function main() {
  const shiki = await getHighlighter({
    themes: ['nord'],
    langs: ['javascript'],
  })

  const code = shiki.codeToHtml('const a = 1', { lang: 'javascript' })
}
```

Can be written in CJS as:

```js
// CJS
async function main() {
  const { getHighlighter } = await import('shikiji')

  const shiki = await getHighlighter({
    themes: ['nord'],
    langs: ['javascript'],
  })

  const code = shiki.codeToHtml('const a = 1', { lang: 'javascript' })
}
```

### CDN Usage

To use `shikiji` in the browser via CDN, you can use [esm.run](https://esm.run) or [esm.sh](https://esm.sh).

```html
<body>
  <div id="foo"></div>

  <script type="module">
    // be sure to specify the exact version
    import { codeToHtml } from 'https://esm.sh/shikiji@0.8.0'
    // or
    // import { codeToHtml } from 'https://esm.run/shikiji@0.8.0'

    const foo = document.getElementById('foo')
    foo.innerHTML = await codeToHtml('console.log("Hi, Shiki on CDN :)")', { lang: 'js', theme: 'vitesse-light' })
  </script>
</body>
```

It's quite efficient as it will only load the languages and themes on demand. For the code snippet above, only four requests will be fired (`shikiji`, `shikiji/themes/vitesse-light.mjs`, `shikiji/langs/javascript.mjs`, `shikiji/wasm.mjs`), with around 200KB data transferred in total.

[Demo](https://jsfiddle.net/rdasqhxu/1/)

### Cloudflare Workers

Cloudflare Workers [does not support initializing WebAssembly from binary data](https://community.cloudflare.com/t/fixed-cloudflare-workers-slow-with-moderate-sized-webassembly-bindings/184668/3), so the default wasm build won't work. You need to upload the wasm as assets and import it directly.

Meanwhile, it's also recommended to use the [Fine-grained Bundle](#fine-grained-bundle) approach to reduce the bundle size.

```ts
import { getHighlighterCore, loadWasm } from 'shikiji/core'
import nord from 'shikiji/themes/nord.mjs'
import js from 'shikiji/langs/javascript.mjs'

// import wasm as assets
import wasm from 'shikiji/onig.wasm'

// load wasm outside of `fetch` so it can be reused
await loadWasm(obj => WebAssembly.instantiate(wasm, obj))

export default {
  async fetch() {
    const highlighter = await getHighlighterCore({
      themes: [nord],
      langs: [js],
    })

    return new Response(highlighter.codeToHtml('console.log(\'shiki\');', { lang: 'js' }))
  },
}
```

## Bundle Size

You can inspect the bundle size in detail on [pkg-size.dev/shikiji](https://pkg-size.dev/shikiji).

As of `v0.9.2`, measured at 15th, December 2023:

| Bundle         | Size (minified) | Size (gzip) | Notes                                             |
| -------------- | --------------: | ----------: | ------------------------------------------------- |
| `shikiji`      |          6.2 MB |      1.2 MB | includes all themes and languages as async chunks |
| `shikiji/core` |           99 KB |       31 KB | without themes or languages, compose on your own  |
| `shikiji/wasm` |          623 KB |      231 KB | wasm binary inlined as base64 string              |
