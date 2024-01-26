# Load Custom Themes

See [All Builtin Themes](/themes) first.

You can load custom themes by passing a `Theme` object into the `themes` array.

```ts twoslash
import { getHighlighter } from 'shiki'

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

const code = `console.log('hello')`
const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'my-theme'
})
```

You can also load themes after the highlighter has been created.

```ts twoslash
// @noErrors
import { getHighlighter } from 'shiki'

// Load the theme object from a file, a network request, or anywhere
const myTheme = JSON.parse(fs.readFileSync('my-theme.json', 'utf8'))

const highlighter = await getHighlighter()

await highlighter.loadTheme(myTheme) // <--

const code = `console.log('hello')`
const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'my-theme'
})
```

The theme is a TextMate theme in JavaScript object. For example, [it should looks like this](https://github.com/antfu/textmate-grammars-themes/blob/main/packages/tm-themes/themes/dark-plus.json).

## Custom Language Aliases

You can register custom language aliases with the `langAlias` option. For example:

```ts twoslash
import { getHighlighter } from 'shiki'

const highlighter = await getHighlighter({
  langs: ['javascript'],
  langAlias: { // [!code hl:3]
    mylang: 'javascript',
  },
})

const code = highlighter.codeToHtml('const a = 1', {
  lang: 'mylang', // [!code hl]
  theme: 'nord'
})
```
