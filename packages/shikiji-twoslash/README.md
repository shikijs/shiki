# shikiji-twoslash

A [shikiji](https://github.com/antfu/shikiji) transformer for [TypeScript's twoslash](https://www.typescriptlang.org/dev/twoslash/).
Provides a similar output as [`shiki-twoslash`](https://shikijs.github.io/twoslash/).

## Install

```bash
npm i -D shikiji-twoslash
```

Unlike `shiki-twoslash` that wraps around `shiki`, this package is **a transformer addon** to Shikiji. This means that for every integration that supports shikiji transformers, you can use this package.

```ts
import {
  codeToHtml,
} from 'shikiji'
import {
  transformerTwoSlash,
} from 'shikiji-twoslash'

const html = await codeToHtml(code, {
  lang: 'ts',
  theme: 'vitesse-dark',
  transformers: [
    transformerTwoSlash(), // <-- here
    // ...
  ],
})
```

Same as `shiki-twoslash`, the output is unstyled. You need to add some extra CSS to make them look good.

## Renderers

Thanks to the flexibility of [`hast`](https://github.com/syntax-tree/hast), this transformer allows customizing how each piece of information is rendered in the output HTML with ASTs.

We provide two renderers built-in, while you can also create your own:

### `rendererClassic`

[Source code](./src/renderer-classic.ts)

This is the default renderer that aligns with the output of [`shiki-twoslash`](https://shikijs.github.io/twoslash/).

You might need to reference `shiki-twoslash`'s CSS to make them look good. [Here](./style-classic.css) we also copied the CSS from `shiki-twoslash` but it might need some cleanup.

### `rendererRich`

[Source code](./src/renderer-rich.ts) | [Live Demo](https://antfu.me/posts/shikiji-twoslash)

This renderer provides a more explicit class name that is always prefixed with `twoslash-` for better scoping. In addition, it runs syntax highlighting on the hover information as well.

```ts
import { rendererRich, transformerTwoSlash } from 'shikiji-twoslash'

transformerTwoSlash({
  renderer: rendererRich() // <--
})
```

Here is an example with the [`style-rich.css`](./style-rich.css):

![](https://github.com/antfu/shikiji/assets/11247099/41f75799-e652-4331-ab75-39dbe8772c81)

## Options

### Explicit Trigger

When integrating with `markdown-it-shikiji` or `rehype-shikiji`, we may not want TwoSlash to run on every code block. In this case, we can set `explicitTrigger` to `true` to only run on code blocks with `twoslash` presented in the codeframe.

```ts
import { transformerTwoSlash } from 'shikiji-twoslash'

transformerTwoSlash({
  explicitTrigger: true // <--
})
```

````md
In markdown, you can use the following syntax to trigger TwoSlash:

```ts
// this is a normal code block
```

```ts twoslash
// this will run TwoSlash
```
````

## Integrations

### VitePress

VitePress uses Shikiji for syntax highlighting since [`1.0.0-rc.30`](https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md#100-rc30-2023-11-23). To use this transformer, you can add it to the `markdown.codeTransformers` option in your VitePress config file.

```ts
// .vitepress/config.ts
import { defineUserConfig } from 'vitepress'
import { transformerTwoSlash } from 'shikiji-twoslash'

export default defineUserConfig({
  markdown: {
    codeTransformers: [
      transformerTwoSlash({
        explicitTrigger: true,
      })
    ]
  },
})
```

## License

MIT
