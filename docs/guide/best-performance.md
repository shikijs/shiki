---
outline: deep
---

# Best Performance Practices

This guide will help you to improve the performance of your Shiki usage.

## Cache the Highlighter Instance

The highlighter instance is expensive to create. Most of the time, you should create the highlighter instance once and reuse it for multiple highlight operations (singleton pattern).

For example:

```ts
import { createHighlighterCore } from 'shiki/core'

const highlighterPromise = createHighlighterCore({ /* ... */ })

export async function highlightCode(code: string, lang: string) {
  const highlighter = await highlighterPromise
  return highlighter.codeToHtml(code, lang)
}
```

When you no longer need a highlighter instance, you can call the `dispose()` method to release the resources. (It can't be GC-ed automatically, you need to do it explicitly.)

```ts
highlighter.dispose()
```

## Fine-Grained Bundle

The pre-built bundles are for easy usage, and mostly intended for a Node.js environment where you aren't worried about the bundle size. If you are building a web application or in a resource-constrained environment, it's always better to use the fine-grained bundles to reduce the bundle size and memory usage.

**Avoid importing `shiki`, `shiki/bundle/full`, `shiki/bundle/web` directly**.

Instead, import fine-grained modules like `shiki/core`, `shiki/engine/javascript`, `@shikijs/langs/typescript`, `@shikijs/themes/dark-plus`, etc.

```ts
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/nord'),
    import('@shikijs/themes/dark-plus'),
    // ...
  ],
  langs: [
    import('@shikijs/langs/typescript'),
    import('@shikijs/langs/javascript'),
    // ...
  ],
  engine: createJavaScriptRegexEngine()
})
```

To compose the fine-grained bundles easily, we also provide the [`shiki-codegen`](/packages/codegen) tool to generate fine-grained bundles for you.

Learn more about [Fine-Grained Bundles](/guide/bundles#fine-grained-bundle).

## Use Shorthands

`createHighlighter` and `createHighlighterCore` load all the themes and languages **upfront** to ensure subsequent highlight operations are synchronous. This can add significant overhead to startup time, especially when you have a lot of themes and languages. Shorthands abstract the theme and language loading process and maintain an internal highlighter instance underneath, only loading the necessary themes and languages when needed. When your highlighting process can be asynchronous, you can use shorthands to reduce startup time.

```ts
import { codeToHtml } from 'shiki'

// Only `javascript` and `nord` will be loaded when calling `codeToHtml`
const html = await codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'nord'
})
```

You can also create your own shorthands with fine-grained bundles. Check out the [Create Shorthands with Fine-Grained Bundles](/guide/shorthands#create-shorthands-with-fine-grained-bundles) section for more details.

## JavaScript Engine and Pre-compiled Languages

Shiki provides [two engines](/guide/regex-engines) for executing regular expressions: [`JavaScript`](/guide/regex-engines#javascript-regexp-engine) and [`Oniguruma`](/guide/regex-engines#oniguruma-engine). The Oniguruma engine is WebAssembly-based and compiled from C code, and `JavaScript` is a pure JavaScript engine that translates Oniguruma-flavored regexes to JavaScript regexes.

If you are bundling Shiki for the web, using the JavaScript engine results in a smaller bundle size and faster startup time. The [precompiled languages](/guide/regex-engines#pre-compiled-languages) can further reduce bundle size and startup time, if your target browsers support the latest RegExp features.

Check the [RegExp Engines](/guide/regex-engines) guide for more details.

## Use Workers

Shiki hightlights code using regular expressions, which can be CPU-intensive. You can offload the highlighting work to a Web Worker/Node Worker to avoid blocking the main thread.

::: info

🚧 We are still working on a guide for creating workers easily.

:::
