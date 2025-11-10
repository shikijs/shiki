import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'
import { transformerNotationDiff } from '../src'

it('transformerNotationDiff works with rose-pine theme (multi-token comments)', async () => {
  const highlighter = await createHighlighter({
    themes: ['rose-pine'],
    langs: ['javascript'],
  })

  const code = 'const a = 1 // [!code --]'

  const html = highlighter.codeToHtml(code, {
    lang: 'javascript',
    theme: 'rose-pine',
    transformers: [transformerNotationDiff()],
  })

  // Should have the diff classes applied
  expect(html).toContain('has-diff')
  expect(html).toContain('diff remove')
  // Should not contain the comment notation in the output
  expect(html).not.toContain('[!code --]')
})

it('transformerNotationDiff still works with dracula theme (single-token comments)', async () => {
  const highlighter = await createHighlighter({
    themes: ['dracula'],
    langs: ['javascript'],
  })

  const code = 'const a = 1 // [!code --]'

  const html = highlighter.codeToHtml(code, {
    lang: 'javascript',
    theme: 'dracula',
    transformers: [transformerNotationDiff()],
  })

  // Should have the diff classes applied
  expect(html).toContain('has-diff')
  expect(html).toContain('diff remove')
  // Should not contain the comment notation in the output
  expect(html).not.toContain('[!code --]')
})
