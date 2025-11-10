import { createHighlighter } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerNotationDiff, transformerNotationFocus, transformerNotationHighlight } from '../src'

describe('multi-token comment support', () => {
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

  it('transformerNotationDiff works with rose-pine theme for add notation', async () => {
    const highlighter = await createHighlighter({
      themes: ['rose-pine'],
      langs: ['javascript'],
    })

    const code = 'const b = 2 // [!code ++]'

    const html = highlighter.codeToHtml(code, {
      lang: 'javascript',
      theme: 'rose-pine',
      transformers: [transformerNotationDiff()],
    })

    expect(html).toContain('has-diff')
    expect(html).toContain('diff add')
    expect(html).not.toContain('[!code ++]')
  })

  it('transformerNotationHighlight works with rose-pine theme', async () => {
    const highlighter = await createHighlighter({
      themes: ['rose-pine'],
      langs: ['javascript'],
    })

    const code = 'const c = 3 // [!code highlight]'

    const html = highlighter.codeToHtml(code, {
      lang: 'javascript',
      theme: 'rose-pine',
      transformers: [transformerNotationHighlight()],
    })

    expect(html).toContain('highlighted')
    expect(html).not.toContain('[!code highlight]')
  })

  it('transformerNotationFocus works with rose-pine theme', async () => {
    const highlighter = await createHighlighter({
      themes: ['rose-pine'],
      langs: ['javascript'],
    })

    const code = 'const d = 4 // [!code focus]'

    const html = highlighter.codeToHtml(code, {
      lang: 'javascript',
      theme: 'rose-pine',
      transformers: [transformerNotationFocus()],
    })

    expect(html).toContain('focused')
    expect(html).not.toContain('[!code focus]')
  })

  it('handles multi-line code with mixed single and multi-token comments', async () => {
    const highlighter = await createHighlighter({
      themes: ['rose-pine'],
      langs: ['javascript'],
    })

    const code = `const a = 1 // [!code --]
const b = 2 // [!code ++]
const c = 3 // [!code highlight]`

    const html = highlighter.codeToHtml(code, {
      lang: 'javascript',
      theme: 'rose-pine',
      transformers: [transformerNotationDiff(), transformerNotationHighlight()],
    })

    expect(html).toContain('has-diff')
    expect(html).toContain('diff remove')
    expect(html).toContain('diff add')
    expect(html).toContain('highlighted')
    expect(html).not.toContain('[!code')
  })

  it('handles edge case where comment does not match pattern', async () => {
    const highlighter = await createHighlighter({
      themes: ['rose-pine'],
      langs: ['javascript'],
    })

    const code = 'const e = 5 // [!invalid notation]'

    const html = highlighter.codeToHtml(code, {
      lang: 'javascript',
      theme: 'rose-pine',
      transformers: [transformerNotationDiff()],
    })

    // Should not have diff classes since notation is invalid
    expect(html).not.toContain('has-diff')
    expect(html).not.toContain('diff remove')
    // Should still contain the invalid notation
    expect(html).toContain('[!invalid notation]')
  })

  it('handles single token without multi-token fallback', async () => {
    const highlighter = await createHighlighter({
      themes: ['rose-pine'],
      langs: ['javascript'],
    })

    const code = 'const f = 6 // regular comment'

    const html = highlighter.codeToHtml(code, {
      lang: 'javascript',
      theme: 'rose-pine',
      transformers: [transformerNotationDiff()],
    })

    expect(html).not.toContain('has-diff')
    expect(html).toContain('regular comment')
  })
})
