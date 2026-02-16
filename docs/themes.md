# Themes

## Bundled Themes

Themes listed below are re-distributed via [`tm-themes`](https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes) into the `shiki` package.

> [!NOTE]
> Shiki does NOT control/maintain the themes. If you want to contribute to the themes, please refer to [`textmate-grammars-themes`](https://github.com/shikijs/textmate-grammars-themes#contribute).

<ThemesList />

Themes are covered by their repositories' respective licenses, which are permissive (apache-2.0, mit, etc), and made available in [this NOTICE](https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-themes/NOTICE).

For loading your custom themes, please reference to [this guide](/guide/load-theme).

## Special Themes

You can set theme to `none` to bypass highlighting. This is useful as the fallback when you receive user specified theme names that are not available. For example:

```ts twoslash theme:none
// @twoslash-cache: {"v":1,"hash":"86ec614e5e60566b55ed222e8e581ca015d4e3a6c7f2bd3716fca6224c3c0fda","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAIBjCGDhoB0GABUIACTQBbVol6NBsJSNLswAcwq8IWNOyFwlAYXFTpXNAHlDx4QB4AQgFcwUVjCgAZZjpuzNoweu6e3lAS+DByMAB8fAC88bwACqQQcuxwME4aWtrxADpg7HJYEKSiqpIy8qyUICLM1UgAnFTeOmj4SACMAAxUaK0hDIggtVYNTRxguIjDU/itzPw05IjtAL4U6NiLBMRkTTT0eILCovgNShlZOXkFOvFNLW2IACwATF0wPT63xGYxgEwIsy6WkWfxWaw2p0QADY9gccHhCCRyCM6OCWBwuHxpvUFCpxOo0JodHoDEYTOZLDIbPY6c5wl4fP5AsFQrx2ZForEEtx7plsrl8pTCiUyhUqjVGbIFO9Rp8vp0QN1tL0BstVeNLorIZroUhYfxVqR1psBgBmVHUQ4Yk7Y6i4phYTI4aoYPisALaJTFEAAK2YRC4/E0hmDKtaE3aX3+gKQSeooPB/p0c1NiFtVAt8JtiB+Dsw6MmmNOOIuk0YnoMZEwfAssBZjjgAGVCt5BXFXB4OVEYnF4gA6XpCpR9mAAJRg2hylOYrIAgmAMLwAD68TtSnS+dibNgAVTKQgHER8M70LyKcc+/X6SOT2qBAFYQaQDZNJ3EcwsqYFpa1qIqWAC6BbiHg5SVNUvDAGIsAzAovA7LwABmYq8AA5HA+DsAA1uwOGlKUVwiLwtyoUkSF1EqrCMDhFEQN4Y6sBA2iMMG0gwKwHG8AA6lUrBQMG3A4XowClLwvBZoGuFhhGcBRuwhiSTJvB/jASg4ZACySbwAD0Rm8MgACEtRUaw4GlDs3BNHEoxIKAuIAnAjh4GgCA7DsQA"}
import { codeToHtml } from 'shiki'

const html = codeToHtml('console.log("Hello World")', {
  lang: 'javascript',
  theme: 'none', // [!code hl]
})
```

