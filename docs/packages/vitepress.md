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

```bash
npm i -D @shikijs/vitepress-twoslash
```

In your [`.vitepress/config.ts`](https://vitepress.dev/reference/site-config):

```ts twoslash
// .vitepress/config.ts
import { transformerTwoslash } from '@shikijs/vitepress-twoslash' // [!code hl]
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerTwoslash() // [!code hl]
    ]
  }
})
```

And then in your [`.vitepress/theme/index.ts`](https://vitepress.dev/guide/custom-theme), install the Vue plugin and import the css with `@shikijs/vitepress-twoslash/styles.css`.

```ts twoslash
// @noErrors: true
// .vitepress/theme/index.ts
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client' // [!code hl]
import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'

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

<br> <!-- leaving some space for the query above -->

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
