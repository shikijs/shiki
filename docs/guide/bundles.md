---
outline: deep
---

# Bundles

The main `shiki` entries bundles all supported themes and languages via lazy dynamic imports. The efficiency shouldn't be a concern to most of the scenarios as the grammar would only be imported/downloaded when it is used. However, when you bundle Shiki into browsers runtime or web workers, even those files are not imported, they still add up to your dist size. We provide the [fine-grained bundle](/guide/install#fine-grained-bundle) to help you compose languages and themes one-by-one as you need.

To make it easier, we also provide some pre-composed bundles for you to use:

## `shiki/bundle/full`

> [Bundle Size](/guide/#bundle-size): 6.4 MB (minified), 1.2 MB (gzip), async chunks included

The full bundle includes all themes and languages, same as the main `shiki` entry.

## `shiki/bundle/web`

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
