# Load Custom Themes

Check [All Builtin Themes](/themes) as well.

You can load custom themes by passing a `Theme` object into the themes array.

```ts
import { getHighlighter } from 'shikiji'

const myTheme = {
  name: 'my-theme',
  settings: [
    {
      scope: ['comment'],
      settings: {
        foreground: '#888'
      }
    },
    // ...
  ]
}

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

// Load the theme object from a file, a network request, or anywhere
const myTheme = JSON.parse(fs.readFileSync('my-theme.json', 'utf8'))

const highlighter = await getHighlighter()

await highlighter.loadTheme(myTheme) // <--

const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'my-theme'
})
```

The theme is a TextMate theme in JavaScript object. For example, [it should looks like this](https://github.com/antfu/textmate-grammars-themes/blob/main/packages/tm-themes/themes/dark-plus.json).
