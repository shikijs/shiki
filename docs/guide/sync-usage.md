# Synchronous Usage

The `await createHighlighter()` and `highlighter.codeToHtml()` are already the effort to do the seperations of asynchronism and synchronism. For most of the cases, you should be able to resolve the async part in the initialization phase and use the highlighter synchronously later.

In some extreme cases that you need to run Shiki completely synchronously, since v1.16, we provide a synchronous version of the core API. You can use `createHighlighterCoreSync` to create a highlighter instance synchronously.

```ts
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki/core'
import js from 'shiki/core/langs/javascript.mjs'
import nord from 'shiki/core/themes/nord.mjs'

const shiki = createHighlighterCoreSync({
  themes: [nord],
  langs: [js],
  engine: createJavaScriptRegexEngine()
})

const html = shiki.highlight('console.log(1)', { lang: 'js', theme: 'nord' })
```

When doing so, it requires all `themes` and `langs` to be provide as plain objects. Also an explicit `engine` is required to be provided. With the new [experimental JavaScript RegExp engine](/guide/regex-engines#javascript-regexp-engine-experimental) you are able to create an engine instance synchronously as well.

The [Oniguruma Engine](/guide/regex-engines#oniguruma-engine) can only be created asynchronously, so you need to resolve the engine promise before creating the sync highlighter.

```ts
import { createHighlighterCoreSync, createWasmOnigEngine } from 'shiki/core'
import js from 'shiki/core/langs/javascript.mjs'
import nord from 'shiki/core/themes/nord.mjs'

// Load this somewhere beforehand
const engine = await createWasmOnigEngine(import('shiki/wasm'))

const shiki = createHighlighterCoreSync({
  themes: [nord],
  langs: [js],
  engine, // if a resolved engine passed in, the rest can still be synced.
})

const html = shiki.highlight('console.log(1)', { lang: 'js', theme: 'nord' })
```
