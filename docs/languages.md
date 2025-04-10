# Languages

## Bundled Languages

Language grammars listed below are re-distributed via [`tm-grammars`](https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-grammars) into the `shiki` package.

<LanguagesList />

Grammars are covered by their repositories’ respective licenses, which are permissive (apache-2.0, mit, etc), and made available in [this NOTICE](https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-grammars/NOTICE).

For loading your custom languages, please reference to [this guide](/guide/load-lang).

## Special Languages

### Plain Text

You can set lang to `text` to bypass highlighting. This is useful as the fallback when you receive user specified language that are not available. For example:

```txt
import { codeToHtml } from 'shiki'

const html = codeToHtml('console.log("Hello World")', {
  lang: 'text', // [!code hl]
  theme: 'vitesse-light',
})
```

`txt`, `plain` are provided as aliases to `text` as well.

### ANSI

A special processed language `ansi` is provided to highlight terminal outputs. For example:

```ansi
[0;32mcolored foreground[0m
[0;42mcolored background[0m

[0;1mbold text[0m
[0;2mdimmed text[0m
[0;4munderlined text[0m
[0;7mreversed text[0m
[0;9mstrikethrough text[0m
[0;4;9munderlined + strikethrough text[0m
```

Check the [raw markdown of code snippet above](https://github.com/shikijs/shiki/blob/main/docs/languages.md?plain=1#L35).
