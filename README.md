# Shikiji 式辞

[![NPM version](https://img.shields.io/npm/v/shikiji?color=a1b858&label=)](https://www.npmjs.com/package/shikiji)

An ESM-focused rewrite of [shiki](https://github.com/shikijs/shiki), a beautiful syntax highlighter based on TextMate grammars.

## Changes

- All grammars/themes/wasm served as pure-ESM, no more CDN, no more assets
- Portable. No Node.js APIs, works in Cloudflare Workers
- Drop CJS and IIFE build, focus on ESM
- Bundles languages/themes on-demand
- API simplified
- Please don't hate me Pine 😜

// WIP, documents will be updated later.

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
import { getHighlighter } from 'shikiji/core'
import { getWasmInlined } from 'shikiji/wasm'
import nord from 'shikiji/themes/nord.mjs'

const shiki = await getHighlighter({
  // instead of strings, you need to pass the imported module
  themes: [nord],
  langs: [
    // Or a getter if you want to do chunk splitting
    () => import('shikiji/languages/javascript.mjs').then(m => m.default),
  ],
  loadWasm: getWasmInlined
})

const code = shiki.codeToHtml('const a = 1', { lang: 'javascript' })
```

The `shikiji/core` entry does not include any themes or languages or the wasm binary.

### Cloudflare Workers

// TODO:

## TODO

- [ ] Port more Shiki API
- [ ] Load new themes and languages after creation

## License

[MIT](./LICENSE)
