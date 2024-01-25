# Languages

## Bundled Languages

Language grammars listed below are re-distributed via [`tm-grammars`](https://github.com/antfu/textmate-grammars-themes/tree/main/packages/tm-grammars) into the `shikiji` package.

<LanguagesList />

Grammars are covered by their repositories’ respective licenses, which are permissive (apache-2.0, mit, etc), and made available in [this NOTICE](https://github.com/antfu/textmate-grammars-themes/blob/main/packages/tm-grammars/NOTICE).

For loading your custom languages, please reference to [this guide](/guide/load-lang).

## Special Languages

### Plain Text

You can set lang to `text` to bypass highlighting. This is useful as the fallback when you receive user specified language that are not available. For example:

```txt
import { codeToHtml } from 'shikiji'

const html = codeToHtml('console.log("Hello World")', {
  lang: 'text', // [!code hl]
  theme: 'vitesse-light', 
})
```

`txt`, `plain` are provided as aliases to `text` as well.

### ANSI

A special processed language `ansi` is provided to highlight terminal outputs. For example:

```ansi
[0;90m┌[0m  [0;36;1mWelcome to VitePress![0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  Where should VitePress initialize the config?[0m
[0;90m│[0m  [0;2m./docs[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  Site title:[0m
[0;90m│[0m  [0;2mMy Awesome Project[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  Site description:[0m
[0;90m│[0m  [0;2mA VitePress Site[0m[0m
[0;90m│[0m[0m
[0;36m◆[0m  Theme:[0m
[0;36m│[0m  [0;32m●[0m Default Theme [0;2m(Out of the box, good-looking docs)[0m[0m
[0;36m│[0m  [0;2m○[0m [0;2mDefault Theme + Customization[0m[0m
[0;36m│[0m  [0;2m○[0m [0;2mCustom Theme[0m[0m
[0;36m└[0m
```

Check the [raw markdown of code snippet above](https://github.com/antfu/shikiji/blob/main/docs/languages.md?plain=1#L35).
