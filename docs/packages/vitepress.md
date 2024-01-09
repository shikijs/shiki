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

And then in your [`.vitepress/theme/index.ts`](https://vitepress.dev/guide/custom-theme):

```ts twoslash
// @noErrors: true
// .vitepress/theme/index.ts
import Theme from 'vitepress/theme'
import TwoSlashFloatingVue from 'vitepress-plugin-twoslash/client' // [!code hl]
import './custom-style.css'
import type { EnhanceAppContext } from 'vitepress'

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoSlashFloatingVue) // [!code hl]
  },
}
```

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
