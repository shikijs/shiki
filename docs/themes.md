# Themes

## All Themes

Inherited from [`shiki`](https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes), here are all the themes bundled in `shikiji`.

<!--all-themes:start-->
| ID |
| --- |
| `css-variables` |
| `dark-plus` |
| `dracula` |
| `dracula-soft` |
| `github-dark` |
| `github-dark-dimmed` |
| `github-light` |
| `hc_light` |
| `light-plus` |
| `material-theme` |
| `material-theme-darker` |
| `material-theme-lighter` |
| `material-theme-ocean` |
| `material-theme-palenight` |
| `min-dark` |
| `min-light` |
| `monokai` |
| `nord` |
| `one-dark-pro` |
| `poimandres` |
| `rose-pine` |
| `rose-pine-dawn` |
| `rose-pine-moon` |
| `slack-dark` |
| `slack-ochin` |
| `solarized-dark` |
| `solarized-light` |
| `vitesse-dark` |
| `vitesse-light` |
<!--all-themes:end-->

## Load Custom Themes

You can load custom themes by passing a `Theme` object into the themes array.

```ts
import { getHighlighter } from 'shikiji'

const myTheme = JSON.parse(fs.readFileSync('my-theme.json', 'utf8'))

const highlighter = await getHighlighter({
  themes: [myTheme]
})

const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'my-theme'
})
```

You can also load themes after the highlighter has been created.

```ts
import { getHighlighter } from 'shikiji'

const myTheme = JSON.parse(fs.readFileSync('my-theme.json', 'utf8'))

const highlighter = await getHighlighter()

await highlighter.loadTheme(myTheme) // <--

const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'my-theme'
})
```

The theme should be a TextMate theme in JSON object. For example, [it should looks like this](https://github.com/antfu/vscode-theme-vitesse/blob/main/themes/vitesse-dark.json).
