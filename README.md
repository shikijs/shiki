# Shikiji 式辞

[![NPM version](https://img.shields.io/npm/v/shikiji?color=a1b858&label=)](https://www.npmjs.com/package/shikiji)

An ESM-focused rewrite of [shiki](https://github.com/shikijs/shiki), a beautiful syntax highlighter based on TextMate grammars.

## Changes

- All grammars/themes/wasm served as pure-ESM, no more [CDN](https://github.com/shikijs/shiki#specify-a-custom-root-directory), no more [assets](https://github.com/shikijs/shiki#specify-how-to-load-webassembly).
- Portable. Does not rely on Node.js APIs or the filesystem, works in any modern JavaScript runtime.
- Drop CJS and IIFE build, focus on ESM (or you can use bundlers).
- Bundles languages/themes composedly.
- Light/Dark dual themes support.
- Zero-dependencies.
- Simplified APIs.
- Please don't hate me Pine 😜 ([What's Next?](#whats-next))

## Install

```sh
npm install -D shikiji
```

## Usage

### Bundled Usage

Basic usage is pretty much the same as `shiki`, only that some APIs are dropped, (for example, the singular `theme` options). Each theme and language file are dynamically imported ES modules, it would be better to list the languages and themes **explicitly** to have the best performance.

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// optionally, load themes and languages after creation
await shiki.loadTheme('vitesse-light')
await shiki.loadLanguage('css')

const code = shiki.codeToHtml('const a = 1', { lang: 'javascript' })
```

#### Shorthands

In addition to the `getHighlighter` function, `shikiji` also provides some shorthand functions for simplier usage.

```js
import { codeToHtml } from 'shikiji'

const code1 = await codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' })
const code2 = await codeToHtml('<div class="foo">bar</div>', { lang: 'html', theme: 'min-dark' })
```

Currently supports:

- `codeToThemedTokens`
- `codeToHtml`
- `codeToHtmlDualThemes`

Internally they maintains a singleton highlighter instance and load the theme/language on demand. Different from `shiki.codeToHtml`, the `codeToHtml` shorthand function returns a Promise and `lang` and `theme` options are required.

### Fine-grained Bundle

When importing `shikiji`, all the themes and languages are bundled as async chunks. Normally it won't be a concern to you as they are not being loaded if you don't use them. While in some cases you want to control what to bundle size, you can use the core and compose your own bundle.

```js
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
    import('shikiji/themes/vitesse-light.mjs')
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

const code = shiki.codeToHtml('const a = 1', { lang: 'javascript' })
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

## Additional Features

### Light/Dark Dual Themes

`shikiji` added an experimental light/dark dual themes support. Different from [markdown-it-shiki](https://github.com/antfu/markdown-it-shiki#dark-mode)'s approach which renders the code twice, `shikiji`'s dual themes approach uses CSS variables to store the colors on each token. It's more performant with a smaller bundle size.

Use `codeToHtmlDualThemes` to render the code with dual themes:

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  themes: ['nord', 'min-light'],
  langs: ['javascript'],
})

const code = shiki.codeToHtmlDualThemes('console.log("hello")', {
  lang: 'javascript',
  theme: {
    light: 'min-light',
    dark: 'nord',
  }
})
```

The following HTML will be generated:

```html
<pre
  class="shiki shiki-dual-themes min-light--nord"
  style="background-color: #ffffff;--shiki-dark-bg:#2e3440ff;color: #ffffff;--shiki-dark-bg:#2e3440ff"
  tabindex="0"
>
  <code>
    <span class="line">
      <span style="color:#1976D2;--shiki-dark:#D8DEE9">console</span>
      <span style="color:#6F42C1;--shiki-dark:#ECEFF4">.</span>
      <span style="color:#6F42C1;--shiki-dark:#88C0D0">log</span>
      <span style="color:#24292EFF;--shiki-dark:#D8DEE9FF">(</span>
      <span style="color:#22863A;--shiki-dark:#ECEFF4">&quot;</span>
      <span style="color:#22863A;--shiki-dark:#A3BE8C">hello</span>
      <span style="color:#22863A;--shiki-dark:#ECEFF4">&quot;</span>
      <span style="color:#24292EFF;--shiki-dark:#D8DEE9FF">)</span>
    </span>
  </code>
</pre>
```

To make it reactive to your site's theme, you need to add a short CSS snippet:

###### Query-based Dark Mode

```css
@media (prefers-color-scheme: dark) {
  .shiki {
    background-color: var(--shiki-dark-bg) !important;
    color: var(--shiki-dark) !important;
  }
  .shiki span {
    color: var(--shiki-dark) !important;
  }
}
```

###### Class-based Dark Mode

```css
html.dark .shiki {
  background-color: var(--shiki-dark-bg) !important;
  color: var(--shiki-dark) !important;
}
html.dark .shiki span {
  color: var(--shiki-dark) !important;
}
```

## Bundle Size

You can inspect the bundle size in detail on [pkg-size.dev/shikiji](https://pkg-size.dev/shikiji).

As of `v0.2.2`, measured at 12th, August 2023:

| Bundle | Size (minified) | Size (gzip) | Notes |
| --- | ---: | ---: | --- |
| `shikiji` | 5.9 MB | 1.2 MB | includes all themes and languages as async chunks |
| `shikiji/core` | 75 KB | 23 KB | no themes or languages, compose on your own |
| `shikiji/wasm` | 623 KB | 231 KB | wasm binary inlined as base64 string |

## What's Next?

Shikiji is a usable exploration of improving the experience of using `shiki` in various of scenarios. It's intended to [push some of the ideas back to `shiki`](https://github.com/shikijs/shiki/issues/510), and eventually, this package might not be needed. Before that, you can use it as a replacement for `shiki` if you have similar requirements. It would be great to hear your feedback and suggestions in the meantime!

## License

[MIT](./LICENSE)
