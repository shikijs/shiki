# Shorthands

In addition to the `getHighlighter` function, `shikiji` also provides some shorthand functions for simpler usage.

```js
import { codeToHtml, codeToThemedTokens } from 'shikiji'

const code = await codeToHtml('const a = 1', { lang: 'javascript', theme: 'nord' })
const tokens = await codeToThemedTokens('<div class="foo">bar</div>', { lang: 'html', theme: 'min-dark' })
```

Currently supports:

- `codeToThemedTokens`
- `codeToHtml`
- `codeToHast`

Internally they maintain a singleton highlighter instance and load the theme/language on demand. Different from `shiki.codeToHtml`, the `codeToHtml` shorthand function returns a Promise and `lang` and `theme` options are required.

> **Note:** These are only available in the [bundled usage](/guide/#bundled-usage), a.k.a the main `shikiji` entry. If you are using the [fine-grained bundle](/guide/#fine-grained-bundle), you can create your own shorthands using [`createSingletonShorthands`](https://github.com/antfu/shikiji/blob/main/packages/shikiji/src/core/bundle-factory.ts) or port it your own.
