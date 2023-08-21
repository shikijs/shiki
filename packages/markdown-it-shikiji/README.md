# markdown-it-shikiji

[Markdown It](https://markdown-it.github.io/) plugin for [shikiji](https://github.com/antfu/shikiji)

## Install

```bash
npm i -D markdown-it-shikiji
```

## Usage

```ts
import MarkdownIt from 'markdown-it'
import Shikiji from 'markdown-it-shikiji'

const md = MarkdownIt()

md.use(await Shikiji({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))
```

## Features

### Line Highlight

In addition to the features of `shikiji`, this plugin also supports line highlighting. You can add `{1,3-4}` after the language name to highlight the specified lines. For example:

~~~md
# Hello World

```js {1,3-4}
console.log('line1') // highlighted
console.log('line2')
console.log('line3') // highlighted
console.log('line4') // highlighted
```
~~~

## License

MIT
