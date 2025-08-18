# API References

## `codeToHast`

You can also get the intermediate `hast` to do custom rendering without serializing them into HTML with `codeToHast`. You can also further integrate the AST with the [unified](https://github.com/unifiedjs) ecosystem.

```ts twoslash
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['nord', 'min-light'],
  langs: ['javascript'],
})
// ---cut---
const root = highlighter.codeToHast(
  'const a = 1',
  { lang: 'javascript', theme: 'nord' }
)

console.log(root)
```

<!-- eslint-skip -->

```ts
{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'pre',
      properties: {
        class: 'shiki vitesse-light',
        style: 'background-color:#ffffff;color:#393a34',
        tabindex: '0'
      },
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'line' },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#AB5959' },
                  children: [ { type: 'text', value: 'const' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#B07D48' },
                  children: [ { type: 'text', value: ' a' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#999999' },
                  children: [ { type: 'text', value: ' =' } ]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { style: 'color:#2F798A' },
                  children: [ { type: 'text', value: ' 1' } ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```
