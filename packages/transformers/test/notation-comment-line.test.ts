import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerNotationDiff, transformerNotationFocus } from '../src'

function getLineClasses(html: string): string[] {
  return [...html.matchAll(/<span class="line([^"]*)">/g)]
    .map(match => match[1].trim())
}

describe('comment-only line notations', () => {
  it('applies notations to a comment line that has visible content', async () => {
    const html = await codeToHtml(`# foo # [!code ++] [!code focus]\nbar`, {
      lang: 'yaml',
      theme: 'github-dark',
      transformers: [transformerNotationDiff(), transformerNotationFocus()],
    })

    const lineClasses = getLineClasses(html)
    expect(lineClasses[0]).toContain('diff add')
    expect(lineClasses[0]).toContain('focused')
    expect(lineClasses[1]).not.toContain('diff add')
    expect(lineClasses[1]).not.toContain('focused')
    expect(html).toContain('# foo')
    expect(html).not.toContain('[!code')
  })

  it('still applies a standalone notation comment to the next line', async () => {
    const html = await codeToHtml(`# [!code ++] [!code focus]\nbar`, {
      lang: 'yaml',
      theme: 'github-dark',
      transformers: [transformerNotationDiff(), transformerNotationFocus()],
    })

    const lineClasses = getLineClasses(html)
    expect(lineClasses).toHaveLength(1)
    expect(lineClasses[0]).toContain('diff add')
    expect(lineClasses[0]).toContain('focused')
    expect(html).toContain('bar')
    expect(html).not.toContain('[!code')
  })
})
