import { createHighlighter } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerColorizedBrackets } from '../src'

describe('dual themes', async () => {
  const lang = 'ts'
  const highlighter = await createHighlighter({
    langs: [lang],
    themes: [
      'dark-plus',
      'light-plus',
      'red',
      'vesper',
      'material-theme-ocean',
    ],
  })

  it('light and dark', () => {
    const htmlStr = highlighter.codeToHtml('{}', {
      lang,
      themes: { light: 'light-plus', dark: 'dark-plus' },
      transformers: [
        transformerColorizedBrackets({
          themes: {
            'light-plus': ['Y', 'P', 'B', 'R'],
            'dark-plus': ['y', 'p', 'b', 'r'],
          },
        }),
      ],
    })
    expect(htmlStr).toContain('<span style="color:Y;--shiki-dark:y">{</span>')
  })

  it('custom prefix', () => {
    const htmlStr = highlighter.codeToHtml('{}', {
      lang,
      themes: { light: 'light-plus', dark: 'dark-plus' },
      cssVariablePrefix: '--custom-',
      transformers: [
        transformerColorizedBrackets({
          themes: {
            'light-plus': ['Y', 'P', 'B', 'R'],
            'dark-plus': ['y', 'p', 'b', 'r'],
          },
        }),
      ],
    })
    expect(htmlStr).toContain('<span style="color:Y;--custom-dark:y">{</span>')
  })

  it('custom default', () => {
    const htmlStr = highlighter.codeToHtml('{}', {
      lang,
      themes: { dark: 'dark-plus', light: 'light-plus' },
      defaultColor: 'dark',
      transformers: [
        transformerColorizedBrackets({
          themes: {
            'light-plus': ['Y', 'P', 'B', 'R'],
            'dark-plus': ['y', 'p', 'b', 'r'],
          },
        }),
      ],
    })
    expect(htmlStr).toContain('<span style="color:y;--shiki-light:Y">{</span>')
  })

  it('no default', () => {
    const htmlStr = highlighter.codeToHtml('{}', {
      lang,
      themes: { light: 'light-plus', dark: 'dark-plus' },
      defaultColor: false,
      transformers: [
        transformerColorizedBrackets({
          themes: {
            'light-plus': ['Y', 'P', 'B', 'R'],
            'dark-plus': ['y', 'p', 'b', 'r'],
          },
        }),
      ],
    })
    expect(htmlStr).toContain(
      '<span style="--shiki-light:Y;--shiki-dark:y">{</span>',
    )
  })

  it('arbitrary theme names', () => {
    const htmlStr = highlighter.codeToHtml('{}', {
      lang,
      themes: {
        cool: 'material-theme-ocean',
        warm: 'red',
        grayscale: 'vesper',
      },
      defaultColor: false,
      transformers: [
        transformerColorizedBrackets({
          themes: {
            'material-theme-ocean': ['blue', 'red'],
            'red': ['yellow', 'red'],
            'vesper': ['gray', 'white'],
          },
        }),
      ],
    })
    expect(htmlStr).toContain(
      '<span style="--shiki-cool:blue;--shiki-warm:yellow;--shiki-grayscale:gray">{</span>',
    )
  })
})
