import { expect, it } from 'vitest'
import { codeToHtml, getSingletonHighlighter } from '../src'

const inputMarkdown1 = `
This is a markdown file

\`\`\`js
console.log("hello")
\`\`\`

~~~vue
<template>
  <div class="foo">bar</div>
</template>

<script lang="ts">
let a: number = 1
</script>
~~~

Even those grammars in markdown are lazy loaded, \`codeToHtml\` shorthand should capture them and load automatically.
`

const inputMarkdown2 = `
Some other languages

~~~ruby
puts "hello"
~~~

\`\`\`html
<div class="foo">bar</div>
\`\`\`
`

it('codeToHtml', async () => {
  const highlighter = await getSingletonHighlighter()
  expect(highlighter.getLoadedLanguages())
    .toEqual([])

  await expect(await codeToHtml(inputMarkdown1, { lang: 'markdown', theme: 'vitesse-light' }))
    .toMatchFileSnapshot(`out/shorthand-markdown1.html`)

  expect.soft(highlighter.getLoadedLanguages().sort())
    .toContainEqual([
      'javascript',
      'vue',
      'md',
      'markdown',
      'typescript',
    ].sort())

  await expect(await codeToHtml(inputMarkdown2, { lang: 'markdown', theme: 'vitesse-light' }))
    .toMatchFileSnapshot(`out/shorthand-markdown2.html`)

  expect.soft(highlighter.getLoadedLanguages().sort())
    .toContainEqual([
      'ruby',
      'html',
    ].sort())
})
