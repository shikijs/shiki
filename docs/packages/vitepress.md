---
outline: deep
---

# VitePress Integration

[VitePress](https://vitepress.dev/) uses Shiki under the hood, so you don't need explicit integration.

VitePress provides [a few options for customizing Shiki](https://github.com/vuejs/vitepress/blob/main/src/node/markdown/markdown.ts#L66-L112). Learn more about them in the [VitePress documentation](https://vitepress.dev/reference/site-config#markdown).

## Twoslash

To enable [TypeScript Twoslash](/packages/twoslash) (type hover on code snippets) in VitePress, we provide a VitePress plugin for easy setup. Pre-styled, with [Floating Vue](https://floating-vue.starpad.dev/) to display the type information out side of the code container.

<Badges name="@shikijs/vitepress-twoslash" />

### Setup

::: code-group

```sh [npm]
npm i -D @shikijs/vitepress-twoslash
```

```sh [yarn]
yarn add -D @shikijs/vitepress-twoslash
```

```sh [pnpm]
pnpm add -D @shikijs/vitepress-twoslash
```

```sh [bun]
bun add -D @shikijs/vitepress-twoslash
```

```sh [deno]
deno add npm:@shikijs/vitepress-twoslash
```

:::

In your [`.vitepress/config.ts`](https://vitepress.dev/reference/site-config):

```ts [.vitepress/config.ts]
import { transformerTwoslash } from '@shikijs/vitepress-twoslash' // [!code hl]
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerTwoslash() // [!code hl]
    ],
    // [!code hl:2]
    // Explicitly load these languages for types hightlighting
    languages: ['js', 'jsx', 'ts', 'tsx']
  }
})
```

And then in your [`.vitepress/theme/index.ts`](https://vitepress.dev/guide/custom-theme), install the Vue plugin and import the css with `@shikijs/vitepress-twoslash/styles.css`.

```ts twoslash [.vitepress/theme/index.ts]
// @noErrors: true
import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client' // [!code hl]
import Theme from 'vitepress/theme'

import '@shikijs/vitepress-twoslash/style.css' // [!code hl]

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue) // [!code hl]
  },
}
```

::: details About style.css

For easier setup, `@shikijs/vitepress-twoslash/styles.css` bundles the styles from `floating-vue` and `@shikijs/twoslash/style-rich.css` so you only need a single entry. If you are using a custom `floating-vue` style or want to have more control of the styles, you can expand them as:

```ts
import '@shikijs/vitepress-twoslash/style.css'

// Equivalent to:
import '@shikijs/twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import '@shikijs/vitepress-twoslash/style-core.css'
```

:::

That's it, you can now use `ts twoslash` in your markdown files to enable the beautiful type hover.

````md
```ts twoslash
console.log('hello')
//      ^?
```
````

It will be rendered as:

```ts twoslash
console.log('hello')
//      ^?
```

<div class="h-100" /> <!-- leaving some space for the query above -->

### Vue Single File Component

In addition, this plugin also integrated [`twoslash-vue`](https://twoslash.netlify.app/packages/vue) for you, so that you can also highlight Vue SFC blocks with `vue twoslash`:

```vue twoslash
<script setup>
import { onMounted, ref } from 'vue'

// reactive state
const count = ref(0)
//             ^?

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">
    Count is: {{ count }}
  </button>
</template>
```

### File System Cache

To speed up the build process, you can enable the file system cache for the generated types, that shares across multiple builds. By default the cache is stored in the `.vitepress/cache/twoslash` along with other VitePress caches.

In your [`.vitepress/config.ts`](https://vitepress.dev/reference/site-config):

```ts [.vitepress/config.ts]
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs' // [!code hl]
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache() // [!code hl]
      })
    ]
  }
})
```

### Inline Cache (experimental)

You can enable inline caching for the generated types. The `@twoslash-cache: ...` will auto insert into your fenced code block during development and build time.

````md [./your-file.md]{2}
```ts twoslash
// @twoslash-cache: [auto generated]
const a: string = 'foo'
```
````

To enable the inline cache in your [`.vitepress/config.ts`](https://vitepress.dev/reference/site-config), please use the config wrapper created by `createTwoslashWithInlineCache`.

```ts [.vitepress/config.ts]
import { createTwoslashWithInlineCache } from '@shikijs/vitepress-twoslash/cache-inline' // [!code hl]
import { defineConfig } from 'vitepress'

const withTwoslashInlineCache = createTwoslashWithInlineCache({ // [!code hl]
  // ... config of transformerTwoslash // [!code hl]
}) // [!code hl]

export default withTwoslashInlineCache( // [!code hl]
  defineConfig({
    markdown: {
      codeTransformers: [
        // move config to the `createTwoslashWithInlineCache()` // [!code error]
        // transformerTwoslash({ ... }) // [!code error]
      ]
    }
  })
) // [!code hl]
```

#### Force re-generate inline cache

To force re-generate the inline cache and ignore the existing cache, you can use the `TWOSLASH_INLINE_CACHE_IGNORE` environment variable when running the `vitepress` cli.

```bash
TWOSLASH_INLINE_CACHE_IGNORE=1 vitepress dev
TWOSLASH_INLINE_CACHE_IGNORE=1 vitepress build
```

#### Remove inline cache

To remove all inline cache, you can use the `TWOSLASH_INLINE_CACHE_REMOVE` environment variable when running the `vitepress` cli.

```bash
TWOSLASH_INLINE_CACHE_REMOVE=1 vitepress dev
TWOSLASH_INLINE_CACHE_REMOVE=1 vitepress build
```
