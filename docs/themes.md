# Themes

## Bundled Themes

Themes listed below are re-distributed via [`tm-themes`](https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes) into the `shiki` package.

<ThemesList />

Themes are covered by their repositories’ respective licenses, which are permissive (apache-2.0, mit, etc), and made available in [this NOTICE](https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-themes/NOTICE).

For loading your custom themes, please reference to [this guide](/guide/load-theme).

## Special Themes

You can set theme to `none` to bypass highlighting. This is useful as the fallback when you receive user specified theme names that are not available. For example:

```ts twoslash theme:none
// @cache: {"version":1,"hash":"teojfmu_VVDND9IjD9xcgqoGUXo2btP4q2ZCFuTG5Ro:ts:7114194f448623262b5f4233f823d758b13f7e052497340c10cf22f693c85d06","twoslash":{"nodes":[{"type":"hover","text":"(alias) const codeToHtml: (code: string, options: CodeToHastOptions<BundledLanguage, BundledTheme>) => Promise<string>\nimport codeToHtml","start":9,"length":10,"target":"codeToHtml","line":0,"character":9},{"type":"hover","text":"const html: Promise<string>","start":42,"length":4,"target":"html","line":2,"character":6},{"type":"hover","text":"(alias) codeToHtml(code: string, options: CodeToHastOptions<BundledLanguage, BundledTheme>): Promise<string>\nimport codeToHtml","start":49,"length":10,"target":"codeToHtml","line":2,"character":13},{"type":"hover","text":"(property) lang: \"javascript\"","start":94,"length":4,"target":"lang","line":3,"character":2},{"type":"hover","text":"(property) CodeOptionsSingleTheme<BundledTheme>.theme: ThemeRegistrationAny | StringLiteralUnion<BundledTheme, string>","start":116,"length":5,"target":"theme","line":4,"character":2}],"code":"import { codeToHtml } from 'shiki'\n\nconst html = codeToHtml('console.log(\"Hello World\")', {\n  lang: 'javascript',\n  theme: 'none', // [!code hl]\n})","meta":{"extension":"ts"}}}
import { codeToHtml } from 'shiki'

const html = codeToHtml('console.log("Hello World")', {
  lang: 'javascript',
  theme: 'none', // [!code hl]
})
```

