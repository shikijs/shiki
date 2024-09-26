# Future

We planned to remove some deprecated APIs and optimize the tree-shaking in the future major versions.

The plan is:

- 👉 `v1.x`: Deprecated APIs are still supported, marked on type level only. With optional runtime warnings to opt-in.
- `v2.0`: No breaking changes, but enable runtime deprecated warnings by default.
- `v3.0`: Remove deprecated APIs, breaking changes.

At the current version, since v1.19.0, you can opt-in to the runtime warnings by calling `enableDeprecationWarnings()` at the beginning of your application.

```ts
import { enableDeprecationWarnings, getHighlighter } from 'shiki'

enableDeprecationWarnings() // [!code hl]

// Then calling deprecated usages like below would warn:
// [SHIKI DEPRECATED]: Use `createHighlighter` instead
const shiki = await getHighlighter(/* ... */)
```

This would help you better prepare for the future changes and upgrade smoothly.

## Notable Deprecations

### `getHighlighter` -> `createHighlighter`

There is no functional changes, but more like correcting the naming to avoid confusion. It should be a straightforward find-and-replace.

### WASM Related APIs

Since the introduce of the [engine system](/guide/regex-engines) in v0.16, the WebAssembly related dependencies are no longer a hard requirement. To make tree-shaking easier and decoupled the engines with the core, two packages are extracted `@shikijs/engine-oniguruma` and `@shikijs/engine-javascript`. They are also re-exported from the main package's `shiki/engine/oniguruma` and `shiki/engine/javascript` respectively.

You might need to change your import path:

```ts
import { loadWasm } from 'shiki' // [!code --]
import { loadWasm } from 'shiki/engine/oniguruma' // [!code ++]
```

`loadWasm` field in `getHighlighter` is replaced with `engine` field:

```ts
import { createHighlighter } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma' // [!code ++]

const shiki = await createHighlighter({
  // ...
  loadWasm: () => import('shiki/wasm'), // [!code --]
  engine: createOnigurumaEngine(() => import('shiki/wasm')), // [!code ++]
})
```
