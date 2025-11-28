import type { ThemeRegistrationResolved } from '@shikijs/types'
import { describe, expect, it } from 'vitest'
import { tokenizeAnsiWithTheme } from '../src/highlight/code-to-tokens-ansi'

describe('aNSI color dimming', () => {
  const mockTheme: ThemeRegistrationResolved = {
    name: 'test-theme',
    type: 'dark',
    fg: '#ffffff',
    bg: '#000000',
    colors: {},
    settings: [],
  }

  it('should dim 3-digit hex colors by adding 80 alpha', () => {
    // ANSI code: dim (2) + RGB color (38;2;r;g;b) + text + reset (0)
    const code = '\x1B[2;38;2;17;34;51mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0]).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // #112233 should become #11223380
    expect(tokens[0][0].color).toBe('#11223380')
  })

  it('should dim 4-digit hex colors by halving the alpha', () => {
    // Using a color that when converted to 4-digit hex would be #1234
    // RGB(17,34,51) = #112233, with alpha 68 (0x44) = #11223344
    const code = '\x1B[2;38;2;17;34;51mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // Should be dimmed with 80 alpha (since we're passing RGB, not RGBA)
    expect(tokens[0][0].color).toBe('#11223380')
  })

  it('should dim 6-digit hex colors by adding 80 alpha', () => {
    // RGB(18,52,86) = #123456
    const code = '\x1B[2;38;2;18;52;86mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // #123456 should become #12345680
    expect(tokens[0][0].color).toBe('#12345680')
  })

  it('should dim 8-digit hex colors by halving the alpha', () => {
    // RGB(18,52,86) = #123456, with alpha 120 (0x78) = #12345678
    // When dimmed, alpha should be 60 (0x3c)
    const code = '\x1B[2;38;2;18;52;86mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // Should be dimmed with 80 alpha
    expect(tokens[0][0].color).toBe('#12345680')
  })

  it('should handle CSS variables for ANSI colors', () => {
    // Test with a theme that uses CSS variables
    const themeWithCssVars: ThemeRegistrationResolved = {
      ...mockTheme,
      colors: {
        'terminal.ansiRed': 'var(--my-ansi-red)',
      },
    }

    // ANSI red color code with dim
    const code = '\x1B[2;31mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(themeWithCssVars, code)

    expect(tokens).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // CSS variable should get -dim suffix
    expect(tokens[0][0].color).toBe('var(--my-ansi-red-dim)')
  })

  it('should not modify colors without dim decoration', () => {
    // No dim decoration, just color
    const code = '\x1B[38;2;18;52;86mtest\x1B[0m'
    const tokens = tokenizeAnsiWithTheme(mockTheme, code)

    expect(tokens).toBeDefined()
    expect(tokens[0][0]).toBeDefined()
    // Should not be dimmed
    expect(tokens[0][0].color).toBe('#123456')
  })
})
