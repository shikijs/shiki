---
outline: deep
---

# RegExp Engines

TextMate grammars are based on regular expressions to match tokens. Usually, we use [Oniguruma](https://github.com/kkos/oniguruma) (a regular expression engine written in C) to parse the grammar. To make it work in JavaScript, we compile Oniguruma to WebAssembly to run in the browser or Node.js.

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

Shiki comes with two built-in engines:

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

This engine uses JavaScript's native RegExp. As regular expressions used by TextMate grammars are written for Oniguruma, they might contain syntax that is not supported by JavaScript's RegExp, or expect different behavior for the same syntax. So we use [Oniguruma-To-ES](https://github.com/slevithan/oniguruma-to-es) to transpile Oniguruma patterns to native JavaScript RegExp.

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

Please check the [compatibility table](/references/engine-js-compat) for the support status of the languages you are using.

Unlike the Oniguruma engine, the JavaScript engine is strict by default. It will throw an error if it encounters a pattern that it cannot convert. If mismatches are acceptable and you want best-effort results whenever possible, you can enable the `forgiving` option to suppress any errors that happened during the conversion:

```ts
const jsEngine = createJavaScriptRegexEngine({ forgiving: true })
// ...use the engine
```

::: info
If you run Shiki on Node.js (or at build time) and bundle size or WebAssembly support is not a concern, we still recommend using the Oniguruma engine for the best result.

The JavaScript engine is best when running in the browser and in cases when you want to control the bundle size.
:::

### JavaScript Runtime Target

For the best result, [Oniguruma-To-ES](https://github.com/slevithan/oniguruma-to-es) uses the [RegExp `v` flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets), which is available in Node.js v20+ and ES2024 ([Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets#browser_compatibility)).

For older environments, it can use the `u` flag but this results in a few less grammars being supported.

By default, the runtime target is automatically detected. You can override this behavior by setting the `target` option:

```ts
const jsEngine = createJavaScriptRegexEngine({
  target: 'ES2018', // or 'ES2024', default is 'auto'
})
```
