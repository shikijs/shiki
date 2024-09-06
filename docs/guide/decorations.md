# Decorations

We provide a decorations API allowing you to wrap custom classes and attributes around ranges of your code.

```ts twoslash
import { codeToHtml } from 'shiki'

const code = `
const x = 10
console.log(x)
`.trim()

const html = await codeToHtml(code, {
  theme: 'vitesse-light',
  lang: 'ts',
  decorations: [ // [!code hl:8]
    {
      // line and character are 0-indexed
      start: { line: 1, character: 0 },
      end: { line: 1, character: 11 },
      properties: { class: 'highlighted-word' }
    }
  ]
})
```

The result will be (styled with CSS in this example):

```ts
// @decorations:[{"start":{"line":1,"character":0},"end":{"line":1,"character":11},"properties":{"class":"highlighted-word"}}]
const x = 10
console.log(x)
```

The positions can also be 0-indexed offsets relative to the code:

```ts twoslash
import { codeToHtml } from 'shiki'

const code = `
const x = 10
console.log(x)
`.trim()
// ---cut---
const html = await codeToHtml(code, {
  theme: 'vitesse-light',
  lang: 'ts',
  decorations: [ // [!code hl:7]
    {
      start: 21,
      end: 24,
      properties: { class: 'highlighted-word' }
    }
  ]
})
```

It renders:

```ts
// @decorations:[{"start":21,"end":24,"properties":{"class":"highlighted-word"}}]
const x = 10
console.log(x)
```

## Use Decorations in Transformers

For advanced use cases, you can use the [Transformers API](./transformers.md) to have full access to the tokens and the HAST tree.

Meanwhile, if you want to append decorations within a transformer, you can do that with:

```ts twoslash
/* eslint-disable import/no-duplicates */
import { DecorationItem } from 'shiki'
function doSomethingWithCode(code: string): DecorationItem[] {
  return []
}
const code: string = ''

// ---cut---
import { codeToHtml, ShikiTransformer } from 'shiki'

const myTransformer: ShikiTransformer = {
  name: 'my-transformer',
  preprocess(code, options) {
    // Generate the decorations somehow
    const decorations = doSomethingWithCode(code)

    // Make sure the decorations array exists
    options.decorations ||= []
    // Append the decorations
    options.decorations.push(...decorations)
  }
}

const html = await codeToHtml(code, {
  theme: 'vitesse-light',
  lang: 'ts',
  transformers: [
    myTransformer
  ]
})
```

Note that you can only provide decorations in or before the `preprocess` hook. In later hooks, changes to the decorations arrary will be ignored.
