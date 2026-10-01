import { describe, expect, it, vi } from 'vitest'
import { shikiToMonaco } from '../src/index'

describe('shikiToMonaco high contrast', () => {
  it('registers high contrast theme with correct base', () => {
    const highlighter = {
      getLoadedThemes: () => ['hc-theme'],
      getTheme: (_id: string) => ({
        name: 'hc-theme',
        type: 'dark',
        colors: { 'editor.foreground': '#ffffff' },
        rules: [],
      }),
      setTheme: () => ({ colorMap: [] }),
      getLoadedLanguages: () => [],
    } as any

    const monaco = {
      editor: {
        defineTheme: vi.fn(),
        setTheme: vi.fn(),
        create: vi.fn(),
      },
      languages: {
        register: vi.fn(),
        getLanguages: () => [],
        setTokensProvider: vi.fn(),
      },
    } as any

    shikiToMonaco(highlighter, monaco, {
      themes: {
        'hc-theme': {
          type: 'hc',
        },
      },
    })

    const defineThemeCall = monaco.editor.defineTheme.mock.calls[0]
    const themeData = defineThemeCall[1]

    // This is what we want to fail currently.
    // It should be 'vs-dark' currently, but we want it to be 'hc-black' eventually.
    // For reproduction, we assert what happens NOW, or we assert what SHOULD happen and expect failure.
    // I'll assert what SHOULD happen so it fails.
    expect(themeData.base).toBe('hc-black')
  })
})
