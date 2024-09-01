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
import { createHighlighter, createWasmOnigEngine } from 'shiki'

const shiki = await createShiki({
  themes: ['nord'],
  langs: ['javascript'],
  engine: createWasmOnigEngine(import('shiki/wasm'))
})
```

## JavaScript RegExp Engine (Experimental)

This experimental engine uses JavaScript's native RegExp. As TextMate grammars' regular expressions are in Oniguruma flavor that might contains syntaxes that are not supported by JavaScript's RegExp, we use [`oniguruma-to-js`](https://github.com/antfu/oniguruma-to-js) to lowering the syntaxes and try to make them compatible with JavaScript's RegExp.

Please check the [compatibility table](/references/engine-js-compat) to check the support status of the languages you are using.

```ts {3,8}
import { createHighlighter, createJavaScriptRegexEngine } from 'shiki'

const jsEngine = createJavaScriptRegexEngine()

const shiki = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
  engine: jsEngine
})

const html = shiki.codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' })
```
