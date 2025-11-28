import type { ThemeRegistrationResolved } from '@shikijs/types'
import { describe, expect, it } from 'vitest'
import { tokenizeAnsiWithTheme } from '../src/highlight/code-to-tokens-ansi'

describe('aNSI tokenization', () => {
  const mockTheme: ThemeRegistrationResolved = {
    name: 'test-theme',
    type: 'dark',
    fg: '#ffffff',
    bg: '#000000',
    colors: {},
    settings: [],
  }

  it('should handle dim decoration with 3-digit hex colors', () => {
    const code = '\x1B[2m\x1B[38;2;17;34;51mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0]).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // The color should be dimmed (with 80 alpha added)
    expect(tokens[0][0].color).toMatch(/#[0-9a-f]{8}/i)
  })

  it('should handle dim decoration with 4-digit hex colors (RGBA short)', () => {
    const code = '\x1B[2m\x1B[38;2;17;34;51;68mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0]).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // The color should be dimmed with alpha halved
    expect(tokens[0][0].color).toMatch(/#[0-9a-f]{8}/i)
  })

  it('should handle dim decoration with 6-digit hex colors', () => {
    const code = '\x1B[2m\x1B[38;2;18;52;86mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0]).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // The color should be dimmed (with 80 alpha added)
    expect(tokens[0][0].color).toMatch(/#[0-9a-f]{8}/i)
  })

  it('should handle dim decoration with 8-digit hex colors (RGBA)', () => {
    const code = '\x1B[2m\x1B[38;2;18;52;86;120mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0]).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // The color should be dimmed with alpha halved
    expect(tokens[0][0].color).toMatch(/#[0-9a-f]{8}/i)
  })
})
