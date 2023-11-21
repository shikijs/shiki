# Shikiji 式辞

[![NPM version](https://img.shields.io/npm/v/shikiji?color=a1b858&label=)](https://www.npmjs.com/package/shikiji)

An ESM-focused rewrite of [shiki](https://github.com/shikijs/shiki), a beautiful syntax highlighter based on TextMate grammars. And [a little bit more](#additional-features).

## Changes

- All grammars/themes/wasm served as pure-ESM, no more [CDN](https://github.com/shikijs/shiki#specify-a-custom-root-directory), no more [assets](https://github.com/shikijs/shiki#specify-how-to-load-webassembly).
- Portable. Does not rely on Node.js APIs or the filesystem, works in any modern JavaScript runtime.
- Drop CJS and IIFE build, focus on ESM (or you can use bundlers).
- [Bundles languages/themes composedly](#fine-grained-bundle).
- [Light/Dark themes support](#lightdark-dual-themes).
- [`hast` support](#codetohast).
- [List of breaking changes from shiki](#breaking-changes-from-shiki).
- Please don't hate me Pine 😜 ([What's Next?](#whats-next))

## Install

```sh
npm install -D shikiji
```

## Integrations

- [`markdown-it-shikiji`](./packages/markdown-it-shikiji) - Markdown-it plugin
- [`rehype-shikiji`](./packages/rehype-shikiji) - Rehype plugin
- [`shikiji-compat`](./packages/shikiji-compat) - Compatibility build aligning with `shiki` API for npm aliasing

## Usage

### Bundled Usage

Basic usage is pretty much the same as `shiki`, only that some APIs are dropped, (for example, the singular `theme` options). While each theme and language file is a dynamically imported ES module, it would be better to list the languages and themes **explicitly** to have the best performance.

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// optionally, load themes and languages after creation
await shiki.loadTheme('vitesse-light')
await shiki.loadLanguage('css')

const code = shiki.codeToHtml('const a = 1', { lang: 'javascript', theme: 'vitesse-light' })
```

Unlike `shiki`, `shikiji` does not load any themes or languages when not specified.

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter()

shiki.codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' }) // throws error, `javascript` is not loaded

await shiki.loadLanguage('javascript') // load the language
```

If you want to load all themes and languages (not recommended), you can iterate all keys from `bundledLanguages` and `bundledThemes`.

```js
import { bundledLanguages, bundledThemes, getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
})

shiki.codeToHtml('const a = 1', { lang: 'javascript' })
```

Or if your usage can be async, you can try the [shorthands](#shorthands) which will load the theme/language on demand.

### Fine-grained Bundle

When importing `shikiji`, all the themes and languages are bundled as async chunks. Normally it won't be a concern to you as they are not being loaded if you don't use them. In some cases, if you want to control what to bundle, you can use the core and compose your own bundle.

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

const code = shiki.codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' })
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
    import { codeToHtml } from 'https://esm.sh/shikiji@0.5.0' 
    // or
    // import { codeToHtml } from 'https://esm.run/shikiji@0.5.0' 

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

## Additional Features

### Shorthands

In addition to the `getHighlighter` function, `shikiji` also provides some shorthand functions for simpler usage.

```js
import { codeToHtml, codeToThemedTokens } from 'shikiji'

const code = await codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' })
const tokens = await codeToThemedTokens('<div class="foo">bar</div>', { lang: 'html', theme: 'min-dark' })
```

Currently supports:

- `codeToThemedTokens`
- `codeToHtml`
- `codeToHast`

Internally they maintain a singleton highlighter instance and load the theme/language on demand. Different from `shiki.codeToHtml`, the `codeToHtml` shorthand function returns a Promise and `lang` and `theme` options are required.

> **Note:** These are only available in the [bundled usage](#bundled-usage), a.k.a the main `shikiji` entry. If you are using the [fine-grained bundle](#fine-grained-bundle), you can create your own shorthands using [`createSingletonShorthands`](https://github.com/antfu/shikiji/blob/main/packages/shikiji/src/core/bundle-factory.ts) or port it your own.

### Light/Dark Dual Themes

`shikiji` added an experimental light/dark dual themes support. Different from [markdown-it-shiki](https://github.com/antfu/markdown-it-shiki#dark-mode)'s approach which renders the code twice, `shikiji`'s dual themes approach uses CSS variables to store the colors on each token. It's more performant with a smaller bundle size.

Change the `theme` option in `codeToHtml` to `options` with `light` and `dark` keys to generate two themes.

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  themes: ['nord', 'min-light'],
  langs: ['javascript'],
})

const code = shiki.codeToHtml('console.log("hello")', {
  lang: 'javascript',
  themes: {
    light: 'vitesse-light',
    dark: 'nord',
  }
})
```

The following HTML will be generated ([demo preview](https://htmlpreview.github.io/?https://raw.githubusercontent.com/antfu/shikiji/main/packages/shikiji/test/out/dual-themes.html)):

```html
<pre
  class="shiki shiki-themes min-light--nord"
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
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
```

###### Class-based Dark Mode

```css
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

#### Multiple Themes

It's also possible to support more than two themes. In the `themes` object, you can have an arbitrary number of themes, and specify the default theme with `defaultColor` option.

```js
const code = shiki.codeToHtml('console.log("hello")', {
  lang: 'javascript',
  themes: {
    light: 'github-light',
    dark: 'github-dark',
    dim: 'github-dimmed',
    // any number of themes
  },

  // optional customizations
  defaultColor: 'light',
  cssVariablePrefix: '--shiki-'
})
```

A token would be generated like:

```html
<span style="color:#1976D2;--shiki-dark:#D8DEE9;--shiki-dim:#566575">console</span>
```

Then update your CSS snippet to control when each theme takes effect. Here is an example:

[Demo preview](https://htmlpreview.github.io/?https://raw.githubusercontent.com/antfu/shikiji/main/packages/shikiji/test/out/multiple-themes.html)

#### Without Default Color

If you want to take full control of the colors or avoid using `!important` to override, you can optionally disable the default color by setting `defaultColor` to `false`.

```js
const code = shiki.codeToHtml('console.log("hello")', {
  lang: 'javascript',
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
  defaultColor: false, // <--
})
```

With it, a token would be generated like:

```html
<span style="--shiki-dark:#D8DEE9;--shiki-light:#2E3440">console</span>
```

In that case, the generated HTML would have no style out of the box, you need to add your own CSS to control the colors.

It's also possible to control the theme in CSS variables. For more, refer to the great research and examples by [@mayank99](https://github.com/mayank99) in [this issue #6](https://github.com/antfu/shikiji/issues/6).


### `codeToHast`

`shikiji` used [`hast`](https://github.com/syntax-tree/hast) to generate HTML. You can use `codeToHast` to generate the AST and use it with tools like [unified](https://github.com/unifiedjs).

```js
const root = shiki.codeToHast('const a = 1', { lang: 'javascript', theme: 'nord' })

console.log(root)
```

<!-- eslint-skip -->

```ts
{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'pre',
      properties: {
        class: 'shiki vitesse-light',
        style: 'background-color:#ffffff;color:#393a34',
        tabindex: '0'
      },
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'line' },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#AB5959' },
                  children: [ { type: 'text', value: 'const' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#B07D48' },
                  children: [ { type: 'text', value: ' a' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#999999' },
                  children: [ { type: 'text', value: ' =' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#2F798A' },
                  children: [ { type: 'text', value: ' 1' } ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Hast transformers

Since `shikiji` uses `hast` internally, you can use the `transforms` option to customize the generated HTML by manipulating the hast tree. You can pass custom functions to modify the tree for different types of nodes. For example:

```js
const code = await codeToHtml('foo\bar', {
  lang: 'js',
  theme: 'vitesse-light',
  transforms: {
    code(node) {
      node.properties.class = 'language-js'
    },
    line(node, line) {
      node.properties['data-line'] = line
      if ([1, 3, 4].includes(line))
        node.properties.class += ' highlight'
    },
    token(node, line, col) {
      node.properties.class = `token:${line}:${col}`
    },
  },
})
```

## Breaking Changes from Shiki

> We take this chance to make some breaking changes that we think are beneficial for the future. We'd suggest you try to migrate those changes if possible, as most of them should be straightforward. If you have very deep integration, you can try our compatibility build [`shikiji-compat`](./packages/shikiji-compat) which aligns with `shiki`'s current API.

As of [`shiki@0.4.3`](https://github.com/shikijs/shiki/releases/tag/v0.14.3):

#### Hard Breaking Changes

Breaking changes applied to both `shikiji` and `shikiji-compat`:

- CJS and IIFE builds are dropped. See [CJS Usage](#cjs-usage) and [CDN Usage](#cdn-usage) for more details.
- `codeToHtml` uses [`hast`](https://github.com/syntax-tree/hast) internally. The generated HTML will be a bit different but should behave the same.
- `css-variables` theme is not supported. Use the [dual themes](#lightdark-dual-themes) approach instead.

#### Soft Breaking Changes

Breaking changes applies to `shikiji`, but are shimmed by [`shikiji-compat`](./packages/shikiji-compat):

- Top-level named export `setCDN`, `loadLanguage`, `loadTheme`, `setWasm` are dropped as they are not needed anymore.
- `BUNDLED_LANGUAGES`, `BUNDLED_THEMES` are moved to `shikiji/langs` and `shikiji/themes` and renamed to `bundledLanguages` and `bundledThemes` respectively.
- `theme` option for `getHighlighter` is dropped, use `themes` with an array instead.
- Highlighter does not maintain an internal default theme context. `theme` option is required for `codeToHtml` and `codeToThemedTokens`.
- `.ansiToHtml` is merged into `.codeToHtml` as a special language `ansi`. Use `.codeToHtml(code, { lang: 'ansi' })` instead.
- `lineOptions` is dropped in favor of the fully customizable `transforms` option.
- `LanguageRegistration`'s `grammar` field is flattened to `LanguageRegistration` itself, refer to the types for more details.

## Bundle Size

You can inspect the bundle size in detail on [pkg-size.dev/shikiji](https://pkg-size.dev/shikiji).

As of `v0.5.0`, measured at 17th, August 2023:

| Bundle | Size (minified) | Size (gzip) | Notes |
| --- | ---: | ---: | --- |
| `shikiji` | 6 MB | 1.2 MB | includes all themes and languages as async chunks |
| `shikiji/core` | 112 KB | 35 KB | no themes or languages, compose on your own |
| `shikiji/wasm` | 623 KB | 231 KB | wasm binary inlined as base64 string |

## What's Next?

Shikiji is a usable exploration of improving the experience of using `shiki` in various scenarios. It's intended to [push some of the ideas back to `shiki`](https://github.com/shikijs/shiki/issues/510), and eventually, this package might not be needed. Before that, you can use it as a replacement for `shiki` if you have similar requirements. It would be great to hear your feedback and suggestions in the meantime!

## License

[MIT](./LICENSE)
