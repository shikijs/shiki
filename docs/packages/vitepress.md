# VitePress Integration

[VitePress](https://vitepress.dev/) uses Shikiji under the hood, so you don't need explicit integration.

VitePress provides [a few options for customizing Shikiji](https://github.com/vuejs/vitepress/blob/main/src/node/markdown/markdown.ts#L66-L112). Learn more about them in the [VitePress documentation](https://vitepress.dev/reference/site-config#markdown).

## TwoSlash

To enable [TypeScript TwoSlash](/packages/twoslash) (type hover on code snippets) in VitePress, we provide a VitePress plugin for easy setup. Pre-styled, with [Floating Vue](https://floating-vue.starpad.dev/) to display the type information out side of the code container.

<Badges name="vitepress-plugin-twoslash" />

```bash
npm i -D vitepress-plugin-twoslash
```

In your [`.vitepress/config.ts`](https://vitepress.dev/reference/site-config):

```ts twoslash
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from 'vitepress-plugin-twoslash' // [!code hl]

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerTwoslash() // [!code hl]
    ]
  }
})
```

And then in your [`.vitepress/theme/index.ts`](https://vitepress.dev/guide/custom-theme), install the Vue plugin and import the css with `vitepress-plugin-twoslash/styles.css`.

```ts twoslash
// @noErrors: true
// .vitepress/theme/index.ts
import Theme from 'vitepress/theme'
import TwoSlashFloatingVue from 'vitepress-plugin-twoslash/client' // [!code hl]
import 'vitepress-plugin-twoslash/style.css' // [!code hl]
import type { EnhanceAppContext } from 'vitepress'

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoSlashFloatingVue) // [!code hl]
  },
}
```

::: details About style.css

For easier setup, `vitepress-plugin-twoslash/styles.css` bundles the styles from `floating-vue` and `shikiji-twoslash/style-rich.css` so you only need a single entry. If you are using a custom `floating-vue` style or want to have more control of the styles, you can expand them as:

```ts
import 'vitepress-plugin-twoslash/style.css'

// Equivalent to:
import 'shikiji-twoslash/style-rich.css'
import 'floating-vue/dist/style.css'
import 'vitepress-plugin-twoslash/style-core.css'
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
