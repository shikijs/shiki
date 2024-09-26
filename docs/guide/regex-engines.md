---
outline: deep
---

# RegExp Engines

TextMate grammars is based on regular expressions to match tokens. Usually, we use [Oniguruma](https://github.com/kkos/oniguruma) (a regular expression engine written in C) to parse the grammar. To make it work in JavaScript, we compile Oniguruma to WebAssembly to run in the browser or Node.js.

Since v1.15, we expose the ability to for users to switch the RegExp engine and provide custom implementations.

An `engine` option is added to the `createHighlighter` and `createHighlighterCore`. For example:

```ts
import { createHighlighter } from 'shiki'

const shiki = await createShiki({
  themes: ['nord'],
  langs: ['javascript'],
  engine: { /* custom engine */ }
})
```

Shiki come with two built-in engines:

## Oniguruma Engine

This is the default engine that uses the compiled Oniguruma WebAssembly. The most accurate and robust engine.

```ts
import { createHighlighter } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const shiki = await createShiki({
  themes: ['nord'],
  langs: ['javascript'],
  engine: createOnigurumaEngine(import('shiki/wasm'))
})
```

## JavaScript RegExp Engine (Experimental)

::: warning Experimental
This feature is experimental and may change without following semver.
:::

This experimental engine uses JavaScript's native RegExp. As TextMate grammars' regular expressions are in Oniguruma flavor that might contains syntaxes that are not supported by JavaScript's RegExp, we use [`oniguruma-to-js`](https://github.com/antfu/oniguruma-to-js) to lowering the syntaxes and try to make them compatible with JavaScript's RegExp.

```ts {2,4,9}
import { createHighlighter } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const jsEngine = createJavaScriptRegexEngine()

const shiki = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
  engine: jsEngine
})

const html = shiki.codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' })
```

Please check the [compatibility table](/references/engine-js-compat) to check the support status of the languages you are using.

If mismatches are acceptable and you want it to get results whatever it can, you can enable the `forgiving` option to suppress any errors happened during the conversion:

```ts
const jsEngine = createJavaScriptRegexEngine({ forgiving: true })
// ...use the engine
```

::: info
If you runs Shiki on Node.js (or at build time), we still recommend using the Oniguruma engine for the best result, as most of the time bundle size or WebAssembly support is not a concern.

The JavaScript engine is more suitable for running in the browser in some cases that you want to control the bundle size.
:::
