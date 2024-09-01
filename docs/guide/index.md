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
- [Bundles languages/themes composedly](/guide/bundles#fine-grained-bundle).
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

## Bundle Size

You can inspect the bundle size in detail on [pkg-size.dev/shiki](https://pkg-size.dev/shiki).

As of `v1.1.6`, measured at 22th, February 2024:

| Bundle              | Size (minified) | Size (gzip) | Notes                                                            |
| ------------------- | --------------: | ----------: | ---------------------------------------------------------------- |
| `shiki`             |          6.9 MB |      1.3 MB | All themes and languages as async chunks                         |
| `shiki/bundle/full` |          6.9 MB |      1.3 MB | Same as `shiki`                                                  |
| `shiki/bundle/web`  |          4.2 MB |      748 KB | All themes and common web languages as async chunks              |
| `shiki/core`        |          106 KB |       34 KB | Core engine without any themes or languages, compose on your own |
| `shiki/wasm`        |          623 KB |      231 KB | WASM binary inlined as base64 string                             |
