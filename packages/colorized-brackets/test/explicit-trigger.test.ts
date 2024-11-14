import { createHighlighter } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerColorizedBrackets } from '../src'

describe('explicitTrigger', async () => {
  const lang = 'ts'
  const theme = 'dark-plus'
  const highlighter = await createHighlighter({
    langs: [lang],
    themes: [theme],
  })

  const validMetaStrings = [
    ['colorize-brackets'],
    ['foo colorize-brackets'],
    ['foo colorize-brackets bar'],
    ['colorize-brackets bar'],
  ]
  it.each(validMetaStrings)('should colorize brackets for meta string "%s"', (meta) => {
    const code = 'let values: number[] = [1, 2, 3];'
    expect(
      highlighter.codeToHtml(code, {
        lang,
        theme,
        transformers: [
          transformerColorizedBrackets({
            themes: { 'dark-plus': ['Y', 'P', 'B', 'R'] },
            explicitTrigger: true,
          }),
        ],
        meta: { __raw: meta },
      }),
    ).toContain('<span style="color:Y">[</span><span style="color:Y">]</span>')
  })

  const invalidMetaStrings = [
    [''],
    ['colorize-brackets-no-word-break'],
    ['no-word-break-colorize-brackets'],
  ]
  it.each(invalidMetaStrings)('should not colorize brackets for meta string "%s"', (meta) => {
    const code = 'let values: number[] = [1, 2, 3];'
    expect(
      highlighter.codeToHtml(code, {
        lang,
        theme,
        transformers: [
          transformerColorizedBrackets({
            themes: { 'dark-plus': ['Y', 'P', 'B', 'R'] },
            explicitTrigger: true,
          }),
        ],
        meta: { __raw: meta },
      }),
    ).not.toContain('<span style="color:Y">[</span><span style="color:Y">]</span>')
  })
})
