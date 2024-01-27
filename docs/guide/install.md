---
outline: deep
---

# Installation

<Badges name="shiki" />

Install via npm, or see [CDN Usage](#cdn-usage):
::: code-group

```sh [npm]
npm install -D shiki
```

```sh [yarn]
yarn add -D shiki
```

```sh [pnpm]
pnpm add -D shiki
```

```sh [bun]
bun add -D shiki
```

:::

## Integrations

We also provide some integrations:

- [markdown-it Plugin](/packages/markdown-it)
- [Rehype Plugin](/packages/rehype)
- [TypeScript Twoslash Integration](/packages/twoslash)
- [Monaco Editor Syntax Highlight](/packages/monaco)
- [CLI](/packages/cli)
- [Common Transformers](/packages/transformers)

## Usage

### Shorthands

The quickest way to get started with `shiki` is to use the shorthands functions we provided. They will load the necessary themes and languages on demand and cache them in memory automatically.

Passing your code snippet to the `codeToHtml` function with the `lang` and `theme` specified, it will return a highlighted HTML string that you can embed in your page. The generated HTML contains inline style for each token, so you don't need extra CSS to style it.

```ts twoslash
import { codeToHtml } from 'shiki'

const code = 'const a = 1' // input code
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark'
})

console.log(html) // highlighted html string
```

Going a bit advanced, you can also use `codeToThemedTokens` or `codeToHast` to get the intermediate data structure, and render them by yourself:

```ts twoslash theme:min-dark
import { codeToThemedTokens } from 'shiki'

const tokens = await codeToThemedTokens('<div class="foo">bar</div>', {
  lang: 'html',
  theme: 'min-dark'
})
```

```ts twoslash theme:catppuccin-mocha
import { codeToHast } from 'shiki'

const hast = codeToHast('.text-red { color: red; }', {
  lang: 'css',
  theme: 'catppuccin-mocha'
})
```

### Highlighter Usage

The [shorthands](#shorthands) we provided are executed asynchronously as we use WASM and load themes and languages on demand internally. In some cases, you may need to highlight code synchronously, so we provide the `getHighlighter` function to create a highlighter instance that can later be used synchronously.

The usage is pretty much the same as `shiki`, where each theme and language file is a dynamically imported ES module. It would be better to list the languages and themes **explicitly** to have the best performance.

```ts twoslash theme:nord
import { getHighlighter } from 'shiki'

// `getHighlighter` is async, it initializes the internal and
// loads the themes and languages specified.
const highlighter = await getHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// then later you can use `highlighter.codeToHtml` synchronously
// with the loaded themes and languages.
const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'nord'
})
```

In addition, if you want to load themes and languages after the highlighter is created, you can use the `loadTheme` and `loadLanguage` methods.

```ts twoslash
import { getHighlighter } from 'shiki'
const highlighter = await getHighlighter({ themes: [], langs: [] })
// ---cut---
// load themes and languages after creation
await highlighter.loadTheme('vitesse-light')
await highlighter.loadLanguage('css')
```

Unlike `shiki` that loads all themes and languages by default, `shiki` requires all themes and languages to be loaded explicitly.

```ts theme:slack-dark twoslash
import { getHighlighter } from 'shiki'

const highlighter = await getHighlighter({ /* ... */ })

highlighter.codeToHtml(
  'const a = 1',
  { lang: 'javascript', theme: 'slack-dark' }
)
// @error: Throw error, `javascript` is not loaded

await highlighter.loadLanguage('javascript') // load the language
```

If you want to load all themes and languages (not recommended), you can iterate all keys from `bundledLanguages` and `bundledThemes`.

```ts twoslash theme:poimandres
import { bundledLanguages, bundledThemes, getHighlighter } from 'shiki'

const highlighter = await getHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
})

highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'poimandres'
})
```

### Fine-grained Bundle

When importing `shiki`, all the themes and languages are bundled as async chunks. Normally it won't be a concern to you as they are not being loaded if you don't use them. In some cases, if you want to control what to bundle, you can use the core and compose your own bundle.

```ts twoslash theme:material-theme-ocean
// @noErrors
// `shiki/core` entry does not include any themes or languages or the wasm binary.
import { getHighlighterCore } from 'shiki/core'

// `shiki/wasm` contains the wasm binary inlined as base64 string.
import getWasm from 'shiki/wasm'

// directly import the theme and language modules, only the ones you imported will be bundled.
import nord from 'shiki/themes/nord.mjs'

const highlighter = await getHighlighterCore({
  themes: [
    // instead of strings, you need to pass the imported module
    nord,
    // or a dynamic import if you want to do chunk splitting
    import('shiki/themes/material-theme-ocean.mjs')
  ],
  langs: [
    import('shiki/langs/javascript.mjs'),
    // shiki will try to interop the module with the default export
    () => import('shiki/langs/css.mjs'),
    // or a getter that returns custom grammar
    async () => JSON.parse(await fs.readFile('my-grammar.json', 'utf-8'))
  ],
  loadWasm: getWasm
})

// optionally, load themes and languages after creation
await highlighter.loadTheme(import('shiki/themes/vitesse-light.mjs'))

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'material-theme-ocean'
})
```

::: info
[Shorthands](#shorthands) are only avaliable in [bundled usage](#bundled-usage). For a fine-grained bundle, you can create your own shorthands using [`createSingletonShorthands`](https://github.com/shikijs/shiki/blob/main/packages/@shikijs/core/src/bundle-factory.ts) or port it yourself.
:::

### Bundle Presets

We also provide some pre-composed bundles for you to use easily, you can learn more about them in the [bundles section](/guide/bundles).

### CJS Usage

`shiki` is published as ESM-only to reduce the package size. It's still possible to use it in CJS, as Node.js supports importing ESM modules dynamically in CJS.

For example, the following ESM code:

```ts twoslash
// ESM
import { getHighlighter } from 'shiki'

async function main() {
  const highlighter = await getHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript'],
  })

  const code = highlighter.codeToHtml('const a = 1', {
    theme: 'vitesse-dark',
    lang: 'javascript',
  })
}
```

Can be written in CJS as:

```ts twoslash
// CJS
async function main() {
  const { getHighlighter } = await import('shiki')

  const highlighter = await getHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript'],
  })

  const code = highlighter.codeToHtml('const a = 1', {
    theme: 'vitesse-dark',
    lang: 'javascript'
  })
}
```

### CDN Usage

To use `shiki` in the browser via CDN, you can use [esm.run](https://esm.run) or [esm.sh](https://esm.sh).

```html theme:rose-pine
<body>
  <div id="foo"></div>

  <script type="module">
    // be sure to specify the exact version
    import { codeToHtml } from 'https://esm.sh/shiki@0.8.0'
    // or
    // import { codeToHtml } from 'https://esm.run/shiki@0.8.0'

    const foo = document.getElementById('foo')
    foo.innerHTML = await codeToHtml('console.log("Hi, Shiki on CDN :)")', {
      lang: 'js',
      theme: 'rose-pine'
    })
  </script>
</body>
```

It's quite efficient as it will only load the languages and themes on demand. For the code snippet above, only four requests will be fired (`shiki`, `shiki/themes/vitesse-light.mjs`, `shiki/langs/javascript.mjs`, `shiki/wasm.mjs`), with around 200KB data transferred in total.

[Demo](https://jsfiddle.net/rdasqhxu/1/)

### Cloudflare Workers

Cloudflare Workers [does not support initializing WebAssembly from binary data](https://community.cloudflare.com/t/fixed-cloudflare-workers-slow-with-moderate-sized-webassembly-bindings/184668/3), so the default wasm build won't work. You need to upload the wasm as assets and import it directly.

Meanwhile, it's also recommended to use the [Fine-grained Bundle](#fine-grained-bundle) approach to reduce the bundle size.

```ts twoslash theme:nord
// @noErrors
import { getHighlighterCore, loadWasm } from 'shiki/core'
import nord from 'shiki/themes/nord.mjs'
import js from 'shiki/langs/javascript.mjs'

// import wasm as assets
await loadWasm(import('shiki/onig.wasm'))

export default {
  async fetch() {
    const highlighter = await getHighlighterCore({
      themes: [nord],
      langs: [js],
    })

    return new Response(highlighter.codeToHtml('console.log(\'shiki\');', {
      theme: 'nord',
      lang: 'js'
    }))
  },
}
```
