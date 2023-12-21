---
outline: deep
---

# Bundles

The main `shikiji` entries bundles all supported themes and languages via lazy dynamic imports. The efficiency shouldn't be a concern to most of the scenarios as the grammar would only be imported/downloaded when it is used. However, when you bundle Shikiji into browsers runtime or web workers, even those files are not imported, they still add up to your dist size. We provide the [fine-grained bundle](/guide/install#fine-grained-bundle) to help you compose languages and themes one-by-one as you need.

To make it easier, we also provide some pre-composed bundles for you to use:

## `shikiji/bundle/full`

The full bundle includes all themes and languages, same as the main `shikiji` entry.

## `shikiji/bundle/web`

The bundle the includes all themes and common web languages like (HTML, CSS, JS, TS, JSON, Markdown, etc.) and some web frameworks (Vue, JSX, Svelte, etc.).

Use as normal, all functions from `shikiji` are also available in the bundle:

```ts
import {
  BundledLanguage,
  BundledTheme,
  codeToHtml,
  getHighlighter
} from 'shikiji/bundle/web' // [!code highlight]

const highlighter = await getHighlighter({
  langs: ['html', 'css', 'js'],
  themes: ['github-dark', 'github-light'],
})
```
