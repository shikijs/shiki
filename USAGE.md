# Simple

```js
import { Shiki } from 'shiki'

const shiki = new Shiki()

shiki.getHighlighter('javascript').then(highlighter => {
  const code = `console.log('shiki');`

  highlighter.codeToHtml(code)

  highlighter.codeToRawHtml(code)
  shiki.getRawCSS()

  shiki.codeToSVG()
  shiki.codeToSketch()
  shiki.codeToPng()
  shiki.codeToJpg()

  const tokens = shiki.codeToThemedTokens()
  customRenderer(tokens)
})

const tokens = tokenizer.tokenize("console.log('shiki')", 'javascript')
const themedTokens = defaultThemes.light_plus.highlight(tokens)

const html = htmlRenderer.render(tokens)
console.log(html)

const image = imageRenderer.render(tokens)
fs.writeFileSync('foo.png', image)
```

## Custom Grammars

```js

import { baseTokenizer, getDefaultLanguages } from 'shiki'

baseTokenizer.addLanguage({
  id: 'foo',
  scope: 'source.foo',
  aliases: ['foolang'],
  grammar: fs.readFileSync('foo.json', 'utf-8'),
  injections: ['source.css', 'source.js']
})

getDefaultLanguages().forEach(l => baseTokenizer.addLanguage(l))
```

## Custom Themes

```js
const customTheme = themeParser.parse(fs.readFileSync('myTheme.json', 'utf-8'))

// Or, build your own theming function

const themedToken = customTheme.highlight(tokens)

const html = htmlRenderer.render(tokens)
```

## Renderer

- font family
- font size
- font styling (italics, bold)
- bg color (override the one from theme)
- margin
- shadow

- want more? custom renderer