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
    // Explicitly load these languages for types highlighting
    languages: ['js', 'jsx', 'ts', 'tsx']
  }
})
```

And then in your [`.vitepress/theme/index.ts`](https://vitepress.dev/guide/custom-theme), install the Vue plugin and import the css with `@shikijs/vitepress-twoslash/styles.css`.

```ts twoslash [.vitepress/theme/index.ts]
// @twoslash-cache: {"v":1,"hash":"2a5df659524ba4854bc92abbfbd15feefdb74ba936c5a020d6bdc7d308b959b2","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAJ2wNUgDNmAYxi8AomHzMwEgIJYsAYQiC6aADph2AWywRSaabPlKV6zfUog4aZiaQBGACxVWMMAHM0+VwB2KkdSHxgGRBAZOQUYZTUNGltPAVxEAAYqMTlScSFXNwBfCnRsdIJiMjtkyJAWDi4+MQ0HXgAVAHcIOFYufAAxVghmNAEfADUAVxhEXmBdXiX+MAc2VjmWFTmEil4ILDHWgH45oZGx32mYa2F2Hz4AXgA+XiIIdigAbl0i3QMjCYOt1ev1zqNxtc7FAIGIEFFrrwsKwpj4BLw0BAVmtWKxeODLpMZrxOux/LwHBgvHAAHS6XQASUMxlM/nYcF4wimCiOYBWvAABjSiGSYFhSPA4AB6fwwfQwKUCWC0GloOAC3jyKC8KZwSQC5gqGm6mCMLo9PpwQbDCFXGbcDUCOCfSSywXeWKWLAawgQADWNLsa2ciAArAAOTzePwBRAuACcISc4Tq5tBVoJkJmdg4YHSLmyuXy1UQgRKZRweEIJHIIS0TDYnB4vBaq1M7Xwctm80WywAMswMBApmg5gARGB3PPqZl5wQ/PnLD0WeLbXiMMRoWhzGIrhLWWpPV7vT4Lv56ZlAjtdoOhSLuAsgLy+fxIUNJsIRPDX+U5tJIAAmQsnGLchS3LahyirKpa2oesokYcUDjITA+C0bwoDgOYFkXJYByHEdx0nNIZyMOc0AXZZeGXOIEk2TdtzMT1V0SGw0CPN4Pm+X5bycSIANDICn2jV9Sw/FM8HQsBML/PMkGCEAchAzcSwAiDMErKJq2qOtbAQxsmhbVp207eVsN7PDB2HUdeAnKcbggWdvAoizqPMWi1w3Lcd3cr0Dy0DiT24sBzwBFkOlM3AqGDfiADZH2fGM33Er8oh/KKn3/MTFKLFSwJcFx1KgrSYJqeD6nlfxoDQ3yWMYYBNRUXgih85j9ySAK5iC3iQwAwIsmEl9YxcAbQgkqIaK9WT0kjHLlIKRA1NKSDNMqGsyr0+osBAyqyD4Q0sB2FQAB55AwZ4ev48MAGYoyGpBbuoZNUpAA7pqQWalLyPLXFDIrVu02DagbRpmwEIRRAkJi9ysDr6H+S9TF3DzWOB6K70A+MBsS0SXAUsaXuRvy4YYVI5MQT7coWgClorCpAY2upEJ2iI9saw7eASU6wHOy6Hpcd9BqSxBHoJuo3rJ9JEzm76FuKZaNPp0rdKZyrCCgPgubO55jT1Y7kAOXk4FOTUeYAXWeRCUTRMA5gABWtgR9cN9gTjmM6zb2A3Dld1YTY9549hpYOXdaOYADkIAZMBhDIZ2fbd02MAt7gjqwbnzvXABqFx9hrG0Nb5kWEzu4XReeuoTXexBpa+0CPv+pX1pVkGm2aYzgQtMEbUJa5zNw7FHFxTYDrTvZQ79s4e6zByY/uQKuLPBHAXbEFLWtC4Z+hWF4RARFkVRdFMUH9Z8Wnu1JFJclKWpOkwEZRGMXwdlOW5Tdff5IURRocVJRlSLFTSToKqdUpttQmkFAdXWpo0zr0zBfB02IXRP31JNFiPoID+kDOjPiD0AKPRxsNaWYtvxr27pvC+1da5UxLC4NSntFLQAqGFIEit5jQxRv5egzVOSkEcrwAA5N/MUEo4BwAEcvcKsDyG2iJJIYQfD9CCIAAJWnYH6dgAAraUwjf5iIALRoDIVaKUYgODOQEbwKUUpeDIAAIQtFgLwfArAzaSKvJFXh/ChGij0dKWU8oJH3wvCvFRaiNHaKlLo0RcBDHGPwFKG+MAaRwnEVYmx9jHGSBcW44JdBQmwFEFMVgpgcJLCkphOY6UKC9jQQkeq7NmqtRhqjAKPYB5QJNGaeJ8C5F8GsbYhxTDnGuN7CUHiVBKrMCQKAKSzoNB4DVCAIoRQgA="}
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
// @twoslash-cache: {"v":1,"hash":"258fd8e6b019224fc5515598774b6ccef0d85eefda3a3ba0992cbaa911ba9952","data":"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"}
console.log('hello')
//      ^?
```

<div class="h-100" /> <!-- leaving some space for the query above -->

### Vue Single File Component

In addition, this plugin also integrated [`twoslash-vue`](https://twoslash.netlify.app/packages/vue) for you, so that you can also highlight Vue SFC blocks with `vue twoslash`:

```vue twoslash
// @twoslash-cache: {"v":1,"hash":"e44d27459becb1dd99d3f24e24e643e1cd8fe190f90d461e4713e08207fe0a39","data":"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"}
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
