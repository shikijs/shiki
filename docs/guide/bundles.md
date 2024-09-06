---
outline: deep
---

# Bundles

The main `shiki` entries bundles all supported themes and languages via lazy dynamic imports. The efficiency shouldn't be a concern to most of the scenarios as the grammar would only be imported/downloaded when it is used. However, when you bundle Shiki into browsers runtime or web workers, even those files are not imported, they still add up to your dist size. We provide the [fine-grained bundle](#fine-grained-bundle) to help you compose languages and themes one-by-one as you need.

## Bundle Presets

To make it easier, we also provide some pre-composed bundles for you to use:

### `shiki/bundle/full`

> [Bundle Size](/guide/#bundle-size): 6.4 MB (minified), 1.2 MB (gzip), async chunks included

The full bundle includes all themes and languages, same as the main `shiki` entry.

### `shiki/bundle/web`

> [Bundle Size](/guide/#bundle-size): 3.8 MB (minified), 695 KB (gzip), async chunks included

The bundle includes all themes and common web languages like (HTML, CSS, JS, TS, JSON, Markdown, etc.) and some web frameworks (Vue, JSX, Svelte, etc.).

Use as normal, all functions from `shiki` are also available in the bundle:

```ts twoslash
import {
  BundledLanguage,
  BundledTheme,
  codeToHtml,
  createHighlighter
} from 'shiki/bundle/web' // [!code highlight]

const highlighter = await createHighlighter({
  langs: ['html', 'css', 'js'],
  themes: ['github-dark', 'github-light'],
})
```

## Fine-grained Bundle

When importing `shiki`, all the themes and languages are bundled as async chunks. Normally it won't be a concern to you as they are not being loaded if you don't use them. In some cases, if you want to control what to bundle, you can use the core and compose your own bundle.

```ts twoslash
// @noErrors
// `shiki/core` entry does not include any themes or languages or the wasm binary.
import { createHighlighterCore } from 'shiki/core'

// directly import the theme and language modules, only the ones you imported will be bundled.
import nord from 'shiki/themes/nord.mjs'

const highlighter = await createHighlighterCore({
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
  // `shiki/wasm` contains the wasm binary inlined as base64 string.
  engine: createWasmOnigEngine(import('shiki/wasm'))
})

// optionally, load themes and languages after creation
await highlighter.loadTheme(import('shiki/themes/vitesse-light.mjs'))

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'material-theme-ocean'
})
```

::: info
[Shorthands](/guide/install#shorthands) are only avaliable in bundle presets. For a fine-grained bundle, you can create your own shorthands using [`createSingletonShorthands`](https://github.com/shikijs/shiki/blob/main/packages/core/src/constructors/bundle-factory.ts#L203) or port it yourself.
:::
