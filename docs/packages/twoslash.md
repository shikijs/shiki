---
outline: deep
---

# shikiji-twoslash

<Badges name="shikiji-twoslash" />

A Shikiji transformer for [`twoslash`](https://github.com/twoslashes/twoslash), provide inline type hover inside code blocks. Inspired by [`shiki-twoslash`](https://shikijs.github.io/twoslash/).

## Install

```bash
npm i -D shikiji-twoslash
```

Unlike `shiki-twoslash` that wraps around `shiki`, this package is **a transformer addon** to Shikiji. This means that for every integration that supports Shikiji transformers, you can use this package.

```ts twoslash
import {
  codeToHtml,
} from 'shikiji'
import {
  transformerTwoslash,
} from 'shikiji-twoslash'

const html = await codeToHtml(`console.log()`, {
  lang: 'ts',
  theme: 'vitesse-dark',
  transformers: [
    transformerTwoslash(), // <-- here
    // ...
  ],
})
```

Just like `shiki-twoslash`, the output is unstyled. You need to add some extra CSS to make them look good.

If you want to run Twoslash on browsers or workers, reference to the [CDN Usage](#cdn-usage) section.

## Renderers

Thanks to the flexibility of [`hast`](https://github.com/syntax-tree/hast), this transformer allows customizing how each piece of information is rendered in the output HTML with ASTs.

We provide two renderers built-in, and you can also create your own:

---

### `rendererRich`

[Source code](https://github.com/antfu/shikiji/blob/main/packages/shikiji-twoslash/src/renderer-rich.ts)

::: tip
This is the default renderer since v0.10.0.
:::

This renderer provides a more explicit class name is prefixed with `twoslash-` for better scoping.
In addition, it runs syntax highlighting on the hover information.

```ts twoslash
import { rendererRich, transformerTwoslash } from 'shikiji-twoslash'

transformerTwoslash({
  renderer: rendererRich() // <--
})
```

Here are a few examples with the built-in [`style-rich.css`](https://github.com/antfu/shikiji/blob/main/packages/shikiji-twoslash/style-rich.css):

<!-- eslint-skip -->

```ts twoslash
// @errors: 2540
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users'.toUpperCase(),
//  ^?
}

todo.title = 'Hello'

Number.parseInt('123', 10)
//      ^|

               //
               //
```

```ts twoslash
import { getHighlighterCore } from 'shikiji/core'

const highlighter = await getHighlighterCore({})
// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```

---

### `rendererClassic`

[Source code](https://github.com/antfu/shikiji/blob/main/packages/shikiji-twoslash/src/renderer-classic.ts)

This renderer aligns with the output of [`shiki-twoslash`](https://shikijs.github.io/twoslash/).

```ts twoslash
import { rendererClassic, transformerTwoslash } from 'shikiji-twoslash'

transformerTwoslash({
  renderer: rendererClassic() // <--
})
```

You might need to reference `shiki-twoslash`'s CSS to make it look good. [Here](https://github.com/antfu/shikiji/blob/main/packages/shikiji-twoslash/style-classic.css) we also copied the CSS from `shiki-twoslash` but it might need some cleanup.

## Options

### Explicit Trigger

When integrating with `markdown-it-shikiji` or `rehype-shikiji`, we may not want Twoslash to run on every code block. In this case, we can set `explicitTrigger` to `true` to only run on code blocks with `twoslash` presented in the codeframe.

```ts twoslash
import { transformerTwoslash } from 'shikiji-twoslash'

transformerTwoslash({
  explicitTrigger: true // <--
})
```

````md
In markdown, you can use the following syntax to trigger Twoslash:

```ts
// this is a normal code block
```

```ts twoslash
// this will run Twoslash
```
````

## Recipes

### CDN Usage

By default `@typescript/twoslash` runs on Node.js and relies on your local system to resolve TypeScript and types for the imports. Import it directly in non-Node.js environments would not work.

Luckily, Twoslash implemented a virtual file system, which allow you to provide your own files for TypeScript to resolve in memory. However, loading these files in the browser is still a challenge. Thanks to the work on the [TypeScript WebSite](https://github.com/microsoft/TypeScript-Website), the TypeScript team has provided some utilities to fetch types on demand through CDN, they call it [Automatic Type Acquisition (ATA)](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ata).

We make tiny wrappers around the building blocks and provide an easy-to-use API in [`twoslash-cdn`](https://github.com/antfu/twoslash-cdn). For example:

```js
// TODO: Replace with explicit versions in production
import { createTransformerFactory, rendererRich } from 'https://esm.sh/shikiji-twoslash@latest/core'
import { codeToHtml } from 'https://esm.sh/shikiji@latest'
import { createStorage } from 'https://esm.sh/unstorage@latest'
import indexedDbDriver from 'https://esm.sh/unstorage@latest/drivers/indexedb'
import { createTwoslashFromCDN } from 'https://esm.sh/twoslash-cdn@latest'

// ============= Initialization =============

// An example using unstorage with IndexedDB to cache the virtual file system
const storage = createStorage({
  driver: indexedDbDriver({ base: 'twoslash-cdn' }),
})

const twoslash = createTwoslashFromCDN({
  storage,
  compilerOptions: {
    lib: ['esnext', 'dom'],
  },
})

const transformerTwoslash = createTransformerFactory(twoslash.runSync)({
  renderer: rendererRich(),
})

// ============= Execution =============

const app = document.getElementById('app')

const source = `
import { ref } from 'vue'

console.log("Hi! Shikiji + Twoslash on CDN :)")

const count = ref(0)
//     ^?
`.trim()

// Before rendering, we need to prepare the types, so that the rendering can happen synchronously
await twoslash.prepareTypes(source)

// Then we can render the code
app.innerHTML = await codeToHtml(source, {
  lang: 'ts',
  theme: 'vitesse-dark',
  transformers: [transformerTwoslash],
})
```

## Integrations

- [VitePress](/packages/vitepress#twoslash) - Enable Twoslash support in VitePress.
