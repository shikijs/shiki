# API References

## `codeToHast`

You can also get the intermediate `hast` to do custom rendering without serializing them into HTML with `codeToHast`. You can also further integrate the AST with the [unified](https://github.com/unifiedjs) ecosystem.

```ts twoslash
// @twoslash-cache: {"v":1,"hash":"aa0ea59b9742ed721640f4d1233696e3e09408080ce58a4fde6a5efd7f40382b","data":"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="}
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
