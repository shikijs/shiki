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
      transformerTwoSlash() // <-- here
    ]
  },
})
```

## License

MIT
