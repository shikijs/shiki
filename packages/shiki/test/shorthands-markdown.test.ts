import { expect, it } from 'vitest'
import { codeToHtml, getSingletonHighlighter } from '../src'

const inputMarkdown1 = `
This is a markdown file

\`\`\`js
console.log("hello")
\`\`\`

~~~pug
div
  p hello
~~~

Even those grammars in markdown are lazy loaded, \`codeToHtml\` shorthand should capture them and load automatically.
`

const inputMarkdown2 = `
Some other languages

\`\`\`js
console.log("hello")
\`\`\`

~~~python
print("hello")
~~~

\`\`\`html
<div class="foo">bar</div>
<style>
  .foo {
    color: red;
  }
</style>
\`\`\`
`

it('codeToHtml', async () => {
  const highlighter = await getSingletonHighlighter()
  expect(highlighter.getLoadedLanguages())
    .toEqual([])

  await expect(await codeToHtml(inputMarkdown1, { lang: 'markdown', theme: 'vitesse-light' }))
    .toMatchFileSnapshot(`out/shorthand-markdown1.html`)

  expect.soft(highlighter.getLoadedLanguages())
    .toContain('javascript')
  expect.soft(highlighter.getLoadedLanguages())
    .toContain('pug')

  await expect(await codeToHtml(inputMarkdown2, { lang: 'markdown', theme: 'vitesse-light' }))
    .toMatchFileSnapshot(`out/shorthand-markdown2.html`)

  expect.soft(highlighter.getLoadedLanguages())
    .toContain('python')
  expect.soft(highlighter.getLoadedLanguages())
    .toContain('html')

  expect.soft(highlighter.getLoadedLanguages())
    .toMatchInlineSnapshot(`
      [
        "javascript",
        "css",
        "html",
        "pug",
        "python",
        "markdown",
        "md",
        "js",
        "jade",
        "py",
      ]
    `)
})
