# Load Custom Themes

Check [All Builtin Themes](/themes) as well.

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
