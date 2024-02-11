---
outline: deep
---

# Introduction

<br>

<span text-brand-yellow text-xl>Shiki</span> <span op75>(式, a Japanese word for ["Style"](https://jisho.org/word/%E5%BC%8F))</span> is a beautiful and powerful syntax highlighter based on TextMate grammar and themes, the same engine as VS Code's syntax highlighting. Provides very accurate and fast syntax highlighting for almost any mainstream programming language.

No custom RegExp to maintain, no custom CSS to maintain, no custom HTML to maintain. And as your favorite languages and themes in VS Code evolve - your syntax highlighting will evolve too.

Oh by the way, all the code blocks in this site are highlighted by Shiki, as you'd expect \:)

## Features

- All grammars/themes/wasm served as ESM, lazy-loaded on demand and bundler-friendly.
- Portable & agnostic. Does not rely on Node.js APIs or the filesystem, works in any modern JavaScript runtime.
- ESM-only ([CDN Usage](/guide/install#cdn-usage), [CJS Usage](/guide/install#cjs-usage)).
- [Bundles languages/themes composedly](/guide/install#fine-grained-bundle).
- [Light/Dark themes support](/guide/dual-themes)
- [`hast` support](/guide/transformers#codetohast)
- [Transformers API](/guide/transformers)
- [Decorations API](/guide/decorations)
- [TypeScript Twoslash integrations](/packages/twoslash)
- [Compatible build](/guide/compat)

## Playground

Here is a little playground for you to try out how Shiki highlights your code. The other code blocks in this docs are rendered on the build time and ships statically, while this playground is rendered on the client side in the browser. Themes and languages are loaded on demand.

<ShikiMiniPlayground />

[Install Shiki](/guide/install) to use it in your project.

## Who is using?

Projects that depend on Shiki (sorted alphabetically):

- [Astro](https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting)
- [Expressive Code](https://expressive-code.com/)
- [JSX email](https://jsx.email/)
- [Lobe UI](https://github.com/lobehub/lobe-ui)
- [Nuxt Content](https://content.nuxt.com/usage/markdown#code-highlighting)
- [Slidev](https://sli.dev/custom/highlighters.html#highlighters)
- [VitePress](https://vitepress.dev/guide/markdown#syntax-highlighting-in-code-blocks)
- [Vocs](https://github.com/wevm/vocs)

## Bundle Size

You can inspect the bundle size in detail on [pkg-size.dev/shiki](https://pkg-size.dev/shiki).

As of `v0.9.11`, measured at 21th, December 2023:

| Bundle              | Size (minified) | Size (gzip) | Notes                                                            |
| ------------------- | --------------: | ----------: | ---------------------------------------------------------------- |
| `shiki`             |          6.4 MB |      1.2 MB | All themes and languages as async chunks                         |
| `shiki/bundle/full` |          6.4 MB |      1.2 MB | Same as `shiki`                                                  |
| `shiki/bundle/web`  |          3.8 MB |      695 KB | All themes and common web languages as async chunks              |
| `shiki/core`        |          100 KB |       31 KB | Core engine without any themes or languages, compose on your own |
| `shiki/wasm`        |          623 KB |      231 KB | WASM binary inlined as base64 string                             |
