# rehype-shikiji

[rehype](https://github.com/rehypejs/rehype) plugin for [shikiji](https://github.com/antfu/shikiji).

## Install

```bash
npm i -D rehype-shikiji
```

## Usage

```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiji from 'rehype-shikiji'
import { expect, test } from 'vitest'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikiji, {
    // or `theme` for a single theme
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    }
  })
  .use(rehypeStringify)
  .process(await fs.readFile('./input.md'))
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
