---
outline: deep
---

# RegExp Engines

TextMate grammars are based on regular expressions that match tokens. More specifically, they assume that [Oniguruma](https://github.com/kkos/oniguruma) (a powerful regex engine written in C) will be used to interpret the regular expressions. To make this work in JavaScript, we compile Oniguruma to WebAssembly to run in the browser or Node.js.

Shiki also offers the ability to switch the regex engine or provide a custom implementation. To do so, add an `engine` option to `createHighlighter` or `createHighlighterCore`. For example:

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

This engine uses JavaScript's native `RegExp`. Since regular expressions used by TextMate grammars are written for Oniguruma, we use [Oniguruma-To-ES](https://github.com/slevithan/oniguruma-to-es) to transpile Oniguruma patterns to native JavaScript regexes.

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

The advantage of using the JavaScript engine is that it doesn't require loading a large WebAssembly file for Oniguruma. It is also faster for some languages, since the regular expressions run as native JavaScript.

Please check the [compatibility table](/references/engine-js-compat) for the support status of languages you are using. As of Shiki 3.9.1, all built-in languages are supported.

::: info
The JavaScript engine is best when running in the browser and in cases when you want to control the bundle size. If you run Shiki on Node.js (or at build time) and bundle size or WebAssembly support is not a concern, the Oniguruma engine ensures maximum language compatibility.
:::

### Use with Unsupported Languages

Unlike the Oniguruma engine, the JavaScript engine is strict by default. It will throw an error if it encounters an invalid Oniguruma pattern or a pattern that it cannot convert. If you want best-effort results for unsupported grammars, you can enable the `forgiving` option to suppress any conversion errors:

```ts
const jsEngine = createJavaScriptRegexEngine({ forgiving: true })
// ...use the engine
```

This can result in highlighting mismatches, so check your results.

### JavaScript Runtime Target

For best results, the JavaScript engine uses the [RegExp `v` flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets), which is available in Node.js v20+ and ES2024 ([browser compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets#browser_compatibility)). For older environments, it automatically uses the `u` flag instead, but this results in a few less grammars being supported.

By default, the runtime target is automatically detected. You can override this behavior by setting the `target` option:

```ts
const jsEngine = createJavaScriptRegexEngine({
  target: 'ES2018', // or 'auto' (default), 'ES2024', 'ES2025'
})
```

### Pre-compiled Languages

Instead of compiling regular expressions on-the-fly, we also provide pre-compiled languages for the JavaScript engine to further reduce startup time.

::: warning
Pre-compiled languages are not yet supported, due to a [known issue](https://github.com/shikijs/shiki/issues/918) that affects many languages. Please use with caution.
:::

::: info
Pre-compiled languages require support for RegExp UnicodeSets (the `v` flag), which requires ES2024 or Node.js 20+, and may not work in older environments. [Can I use](https://caniuse.com/mdn-javascript_builtins_regexp_unicodesets).
:::

You can install them with `@shikijs/langs-precompiled`, and change your `@shikijs/langs` imports to `@shikijs/langs-precompiled`:

```ts
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRawEngine } from 'shiki/engine/javascript'

const highlighter = await createHighlighterCore({
  langs: [
    import('@shikijs/langs/javascript'), // [!code --]
    import('@shikijs/langs/typescript'), // [!code --]
    import('@shikijs/langs-precompiled/javascript'), // [!code ++]
    import('@shikijs/langs-precompiled/typescript'), // [!code ++]
    // ...
  ],
  themes: [
    import('@shikijs/themes/nord'),
  ],
  engine: createJavaScriptRegexEngine(), // [!code --]
  engine: createJavaScriptRawEngine(), // [!code ++]
})
```

If you are not using custom grammars that require transpilation, you can use `createJavaScriptRawEngine` to skip the transpilation step, further reducing bundle size.

If you are using [`shiki-codegen`](/packages/codegen), you can generate pre-compiled languages with the `--precompiled` and `--engine=javascript-raw` flags.
