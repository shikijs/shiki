# @shikijs/twoslash-unocss

UnoCSS-backed [twoslash](https://twoslash.netlify.app/) runner for [Shiki](https://shiki.style).

Hover over UnoCSS utility classes in your code blocks and see the generated CSS — just like how twoslash shows TypeScript types on hover.

## Install

```bash
npm i @shikijs/twoslash-unocss @shikijs/twoslash @unocss/core @unocss/preset-uno
```

## Usage

```ts
import { createTwoslasher } from '@shikijs/twoslash-unocss'
import { createTransformerFactory, rendererRich } from '@shikijs/twoslash/core'
import presetUno from '@unocss/preset-uno'
import { codeToHtml } from 'shiki'

const twoslasher = createTwoslasher({
  config: {
    presets: [presetUno()],
  },
})

// Pre-resolve UnoCSS classes, then feed results to Shiki
const code = 'text-red-500 flex mt-4'
const resolved = await twoslasher(code, 'html')

const html = await codeToHtml(resolved.code, {
  lang: 'html',
  theme: 'vitesse-dark',
  transformers: [
    createTransformerFactory(
      () => resolved,
      rendererRich(),
    )({
      langs: ['html', 'css', 'vue'],
    }),
  ],
})
```

> **Note:** Because UnoCSS operates asynchronously, the twoslash
> runner is async. Call it before `codeToHtml` and pass the pre-resolved
> result into `createTransformerFactory`.

## How It Works

For every whitespace-separated token in the code block the runner
passes it to UnoCSS's `createGenerator`. If the token is a valid
utility class, the generated CSS is surfaced as a hover popup using
the standard twoslash protocol.

## License

MIT
