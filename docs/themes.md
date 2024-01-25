# Themes

## Bundled Themes

Themes listed below are re-distributed via [`tm-themes`](https://github.com/antfu/textmate-grammars-themes/tree/main/packages/tm-themes) into the `shikiji` package.

<ThemesList />

Themes are covered by their repositories’ respective licenses, which are permissive (apache-2.0, mit, etc), and made available in [this NOTICE](https://github.com/antfu/textmate-grammars-themes/blob/main/packages/tm-themes/NOTICE).

For loading your custom themes, please reference to [this guide](/guide/load-theme).

## Special Themes

You can set theme to `none` to bypass highlighting. This is useful as the fallback when you receive user specified theme names that are not available. For example:

```ts twoslash theme:none
import { codeToHtml } from 'shikiji'

const html = codeToHtml('console.log("Hello World")', {
  lang: 'javascript',
  theme: 'none', // [!code hl]
})
```

