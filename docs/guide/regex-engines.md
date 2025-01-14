---
outline: deep
---

# RegExp Engines

TextMate grammars are based on regular expressions that match tokens. More specifically, they assume that [Oniguruma](https://github.com/kkos/oniguruma) (a powerful regex engine written in C) will be used to interpret the regular expressions. To make this work in JavaScript, we compile Oniguruma to WebAssembly to run in the browser or Node.js.

Since v1.15, we expose the ability for users to switch the regex engine or provide a custom implementation. To do so, add an `engine` option to `createHighlighter` or `createHighlighterCore`. For example:

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

This is the default engine that uses the compiled Oniguruma WebAssembly.

```ts
import { createHighlighter } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const shiki = await createShiki({
  themes: ['nord'],
  langs: ['javascript'],
  engine: createOnigurumaEngine(import('shiki/wasm'))
})
```

## JavaScript RegExp Engine

This engine uses JavaScript's native `RegExp`. Since regular expressions used by TextMate grammars are written for Oniguruma, they might contain syntax that is not supported by JavaScript's `RegExp`, or expect different behavior for the same syntax. So we use [Oniguruma-To-ES](https://github.com/slevithan/oniguruma-to-es) to transpile Oniguruma patterns to native JavaScript regexes.

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

The advantages of using the JavaScript engine are that it doesn't require loading a large WebAssembly file for Oniguruma and it is faster for some grammars (since the regular expressions run as native JavaScript).

Please check the [compatibility table](/references/engine-js-compat) for the support status of languages you are using.

The JavaScript engine is strict by default, and will throw an error if it encounters a pattern that it cannot convert. If mismatches are acceptable and you want best-effort results for unsupported grammars, you can enable the `forgiving` option to suppress any conversion errors:

```ts
const jsEngine = createJavaScriptRegexEngine({ forgiving: true })
// ...use the engine
```

::: info
If you run Shiki on Node.js (or at build time) and bundle size or WebAssembly support is not a concern, we still recommend using the Oniguruma engine.

The JavaScript engine is best when running in the browser and in cases when you want to control the bundle size.
:::

### JavaScript Runtime Target

For best results, the JavaScript engine uses the [RegExp `v` flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets), which is available in Node.js v20+ and ES2024 ([browser compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets#browser_compatibility)). For older environments, it automatically uses the `u` flag instead, but this results in a few less grammars being supported.

By default, the runtime target is automatically detected. You can override this behavior by setting the `target` option:

```ts
const jsEngine = createJavaScriptRegexEngine({
  target: 'ES2018', // or 'auto' (default), 'ES2024', 'ES2025'
})
```
