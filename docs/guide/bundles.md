---
outline: deep
---

# Bundles

The main `shiki` entries bundles all supported themes and languages via lazy dynamic imports. The efficiency shouldn't be a concern to most of the scenarios as the grammar would only be imported/downloaded when it is used. However, when you bundle Shiki into browsers runtime or web workers, even those files are not imported, they still add up to your dist size. We provide the [fine-grained bundle](#fine-grained-bundle) to help you compose languages and themes one-by-one as you need.

::: info
If you are building a web application, or in a performance-sensitive environment, it's always better to use the [fine-grained bundles](#fine-grained-bundle) to reduce the bundle size and memory usage. Learn more about [Best Performance Practices](/guide/best-performance).
:::

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
// @twoslash-cache: {"v":1,"hash":"bc09922b156c22ae5db0d1f3a370b9e8a8102a79c22e1cc1c2c7a69ad448c686","data":"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"}
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
// @twoslash-cache: {"v":1,"hash":"e26334099d2c6d29154f99e9d0012a1b222bc32fc1d6530631f2db8bdeee0c9f","data":"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"}
// @noErrors
// directly import the theme and language modules, only the ones you imported will be bundled.
import nord from '@shikijs/themes/nord'

// `shiki/core` entry does not include any themes or languages or the wasm binary.
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const highlighter = await createHighlighterCore({
  themes: [
    // instead of strings, you need to pass the imported module
    nord,
    // or a dynamic import if you want to do chunk splitting
    import('@shikijs/themes/material-theme-ocean')
  ],
  langs: [
    import('@shikijs/langs/javascript'),
    // shiki will try to interop the module with the default export
    () => import('@shikijs/langs/css'),
    // or a getter that returns custom grammar
    async () => JSON.parse(await fs.readFile('my-grammar.json', 'utf-8'))
  ],
  // `shiki/wasm` contains the wasm binary inlined as base64 string.
  engine: createOnigurumaEngine(import('shiki/wasm'))
})

// optionally, load themes and languages after creation
await highlighter.loadTheme(import('@shikijs/themes/vitesse-light'))

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'material-theme-ocean'
})
```

::: info
[Shorthands](/guide/install#shorthands) are only avaliable in bundle presets. For a fine-grained bundle, you can create your own shorthands using [`createSingletonShorthands`](https://github.com/shikijs/shiki/blob/main/packages/core/src/constructors/bundle-factory.ts#L203) or port it yourself.
:::

### Handling Embedded Languages

Some languages like `markdown`, `vue`, `svelte`, `mdx`, etc. contain embedded languages (e.g., code blocks in markdown can contain JavaScript, Python, HTML, etc.). When using fine-grained bundles, **these embedded languages are not loaded automatically** to keep the bundle size small and give you full control.

If you want to highlight embedded languages in your code, you have several options:

#### Option 1: Manually Load Embedded Languages

You can manually load all the languages you expect to use:

```ts
import { createHighlighterCore } from 'shiki/core'

const highlighter = await createHighlighterCore({
  themes: [import('@shikijs/themes/nord')],
  langs: [
    import('@shikijs/langs/markdown'),
    import('@shikijs/langs/javascript'),
    import('@shikijs/langs/typescript'),
    import('@shikijs/langs/python'),
    // ...add other languages you need
  ],
  engine: createOnigurumaEngine(import('shiki/wasm'))
})
```

#### Option 2: Dynamically Load Based on Content

Use the `guessEmbeddedLanguages` utility to detect and load embedded languages dynamically:

```ts
import { createHighlighterCore, guessEmbeddedLanguages } from 'shiki/core'

const highlighter = await createHighlighterCore({
  themes: [import('@shikijs/themes/nord')],
  langs: [import('@shikijs/langs/markdown')],
  engine: createOnigurumaEngine(import('shiki/wasm'))
})

// Get your markdown content
const markdownCode = '```js\nconsole.log("hello")\n```'

// Detect embedded languages
const embeddedLangs = guessEmbeddedLanguages(markdownCode, 'markdown', highlighter)

// Load them dynamically
await Promise.all(
  embeddedLangs.map(lang => 
    highlighter.loadLanguage(import(`@shikijs/langs/${lang}`))
  )
)

// Now highlight with all required languages loaded
const html = highlighter.codeToHtml(markdownCode, {
  lang: 'markdown',
  theme: 'nord'
})
```

#### Option 3: Create Custom Shorthands with Auto-Loading

For the best user experience similar to the bundle presets, create custom shorthands with automatic embedded language detection:

```ts
import { 
  createHighlighterCore,
  createSingletonShorthands,
  createdBundledHighlighter,
  guessEmbeddedLanguages 
} from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

// Define your bundled languages
const bundledLanguages = {
  javascript: () => import('@shikijs/langs/javascript'),
  typescript: () => import('@shikijs/langs/typescript'),
  python: () => import('@shikijs/langs/python'),
  markdown: () => import('@shikijs/langs/markdown'),
  // ... add more languages as needed
}

const bundledThemes = {
  nord: () => import('@shikijs/themes/nord'),
  // ... add more themes as needed
}

// Create a custom highlighter factory
const createHighlighter = createdBundledHighlighter({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createOnigurumaEngine(import('shiki/wasm'))
})

// Create shorthands with auto-loading embedded languages
export const { codeToHtml, codeToHast, getSingletonHighlighter } = 
  createSingletonShorthands(createHighlighter, {
    guessEmbeddedLanguages
  })

// Now you can use it like the bundle presets
const html = await codeToHtml(markdownCode, {
  lang: 'markdown',
  theme: 'nord'
})
// Embedded languages in the markdown will be automatically detected and loaded!
```

::: tip
The `guessEmbeddedLanguages` function detects languages from:
- Markdown fenced code blocks: ` ```lang ` or `~~~lang`
- HTML/Vue language attributes: `lang="javascript"`
- LaTeX environments: `\begin{language}`
:::

