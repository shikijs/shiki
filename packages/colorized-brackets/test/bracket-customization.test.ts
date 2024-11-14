import { createHighlighter } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerColorizedBrackets } from '../src'

describe('bracket customization', async () => {
  const lang = 'ts'
  const theme = 'dark-plus'
  const highlighter = await createHighlighter({
    langs: [lang],
    themes: [theme],
  })

  it('denied scopes', () => {
    const code = 'let values: number[] = [1, 2, 3];'

    expect(
      highlighter.codeToHtml(code, {
        lang,
        theme,
        transformers: [
          transformerColorizedBrackets({
            themes: { 'dark-plus': ['Y', 'P', 'B', 'R'] },
          }),
        ],
      }),
    ).toContain('<span style="color:Y">[</span><span style="color:Y">]</span>')

    expect(
      highlighter.codeToHtml(code, {
        lang,
        theme,
        transformers: [
          transformerColorizedBrackets({
            themes: { 'dark-plus': ['Y', 'P', 'B', 'R'] },
            bracketPairs: [
              {
                opener: '[',
                closer: ']',
                scopesDenyList: ['meta.type.annotation'],
              },
              { opener: '{', closer: '}' },
              { opener: '(', closer: ')' },
            ],
          }),
        ],
      }),
    ).toContain(
      '<span style="color:#D4D4D4">[</span><span style="color:#D4D4D4">]</span>',
    )
  })
})
