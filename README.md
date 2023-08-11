# Shikiji 式辞

[![NPM version](https://img.shields.io/npm/v/shikiji?color=a1b858&label=)](https://www.npmjs.com/package/shikiji)

An ESM-focused rewrite of [shiki](https://github.com/shikijs/shiki), a beautiful syntax highlighter based on TextMate grammars.

## Changes

- All grammars/themes/wasm served as pure-ESM, no more CDN, no more assets.
- Portable. Does not rely on Node.js APIs or the filesystem, works in any JavaScript runtime.
- Drop CJS and IIFE build, focus on ESM (or use bundlers).
- Bundles languages/themes composedly.
- Zero dependencies.
- Simplified API.
- Please don't hate me Pine 😜

## Install

```sh
npm install -D shikiji
```

## Usage

Basic usage is pretty much the same as shiki, only that some APIs like singular `theme` options are dropped. Each theme and language file are dynamically imported ES modules, it would be the best to list the languages and themes explicitly to have the best performance.

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

const code = shiki.codeToHtml('const a = 1', { lang: 'javascript' })
```

### Fine-grained Bundling

When importing `shikiji`, all the themes and languages are bundled as async chunks. Normally it won't be a concern to you as they are not being loaded if you don't use them. While in some cases you really want to control what to bundle, you can use the core and compose your own bundle.

```js
// `shikiji/core` entry does not include any themes or languages or the wasm binary.
import { getHighlighter } from 'shikiji/core'

// `shikiji/wasm` contains the wasm binary inlined as base64 string.
import { getWasmInlined } from 'shikiji/wasm'

// directly import the theme and language modules, only the ones you imported will be bundled.
import nord from 'shikiji/themes/nord.mjs'

const shiki = await getHighlighter({
  // instead of strings, you need to pass the imported module
  themes: [nord],
  langs: [
    // Or a getter if you want to do chunk splitting
    () => import('shikiji/languages/javascript.mjs')
  ],
  loadWasm: getWasmInlined
})

// optionally, load themes and languages after creation
await shiki.loadTheme(() => import('shikiji/themes/vitesse-light.mjs'))

const code = shiki.codeToHtml('const a = 1', { lang: 'javascript' })
```

### Cloudflare Workers

Cloudflare Workers [does not support initializing WebAssembly from binary data](https://community.cloudflare.com/t/fixed-cloudflare-workers-slow-with-moderate-sized-webassembly-bindings/184668/3), so the default wasm build won't work. You need to upload the wasm as assets and import it directly.

Meanwhile, it's also recommended to use the [Fine-grained Bundling](#fine-grained-bundling) approach to reduce the bundle size.

```ts
import { getHighlighterCore, loadWasm } from 'shikiji/core'
import nord from 'shikiji/themes/nord.mjs'
import js from 'shikiji/languages/javascript.mjs'

// Import wasm as assets
import wasm from 'shikiji/onig.wasm'

// Load wasm outside of `fetch` so it can be reused
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

## TODO

- [ ] Port more Shiki API

## License

[MIT](./LICENSE)
