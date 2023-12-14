import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import Shikiji from 'markdown-it-shikiji'
import { rendererRich, transformerTwoSlash } from 'shikiji-twoslash'

const styleTag = `
<link rel="stylesheet" href="../../../style-rich.css" />
<style>
.dark .shiki,
.dark .shiki span {
  color: var(--shiki-dark, inherit);
  background-color: var(--shiki-dark-bg, inherit);
  --twoslash-popup-bg: var(--shiki-dark-bg, inherit);
}

html:not(.dark) .shiki,
html:not(.dark) .shiki span {
  color: var(--shiki-light, inherit);
  background-color: var(--shiki-light-bg, inherit);
  --twoslash-popup-bg: var(--shiki-light-bg, inherit);
}
</style>
`

describe('markdown-it', () => {
  it('works', async () => {
    const md = MarkdownIt()

    md.use(await Shikiji({
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
      transformers: [
        transformerTwoSlash({
          explicitTrigger: true,
          renderer: rendererRich(),
        }),
      ],
    }))

    const html = md.render(`
# Hello

Code block with twoslash:

\`\`\`ts twoslash
const a = 123
//    ^?
\`\`\`

Code block without twoslash:

\`\`\`ts
const a = 123
//    ^?
\`\`\`
    `.trim())

    expect(styleTag + html).toMatchFileSnapshot('./out/markdown-it/works.html')
  })

  it('with highlight lines', async () => {
    const md = MarkdownIt()

    md.use(await Shikiji({
      highlightLines: true,
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
      transformers: [
        transformerTwoSlash({
          explicitTrigger: true,
          renderer: rendererRich(),
        }),
      ],
    }))

    const html = md.render(`
# Hello

\`\`\`ts {1,3} twoslash
const a = 123
const b = 123
const v = 123
//    ^?
\`\`\`

\`\`\`ts twoslash {2}
const a = 123
const b = 123
const v = 123
//    ^?
\`\`\`
    `.trim())

    expect(styleTag + html).toMatchFileSnapshot('./out/markdown-it/highlight-lines.html')
  })
})
