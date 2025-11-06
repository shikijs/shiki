import type { ThemeRegistrationResolved } from '@shikijs/types'
import { describe, expect, it } from 'vitest'
import { textmateThemeToMonacoTheme } from '../src/index'

describe('high-contrast theme support', () => {
  it('should set base to hc-black for dark high-contrast themes', () => {
    const theme: ThemeRegistrationResolved = {
      name: 'github-dark-high-contrast',
      type: 'dark',
      fg: '#ffffff',
      bg: '#000000',
      colors: {},
      settings: [],
    }

    const monacoTheme = textmateThemeToMonacoTheme(theme)
    expect(monacoTheme.base).toBe('hc-black')
  })

  it('should set base to hc-light for light high-contrast themes', () => {
    const theme: ThemeRegistrationResolved = {
      name: 'github-light-high-contrast',
      type: 'light',
      fg: '#000000',
      bg: '#ffffff',
      colors: {},
      settings: [],
    }

    const monacoTheme = textmateThemeToMonacoTheme(theme)
    expect(monacoTheme.base).toBe('hc-light')
  })

  it('should set base to vs-dark for regular dark themes', () => {
    const theme: ThemeRegistrationResolved = {
      name: 'github-dark',
      type: 'dark',
      fg: '#ffffff',
      bg: '#000000',
      colors: {},
      settings: [],
    }

    const monacoTheme = textmateThemeToMonacoTheme(theme)
    expect(monacoTheme.base).toBe('vs-dark')
  })

  it('should set base to vs for regular light themes', () => {
    const theme: ThemeRegistrationResolved = {
      name: 'github-light',
      type: 'light',
      fg: '#000000',
      bg: '#ffffff',
      colors: {},
      settings: [],
    }

    const monacoTheme = textmateThemeToMonacoTheme(theme)
    expect(monacoTheme.base).toBe('vs')
  })

  it('should handle case-insensitive high-contrast detection', () => {
    const theme: ThemeRegistrationResolved = {
      name: 'Custom-High-Contrast-Theme',
      type: 'dark',
      fg: '#ffffff',
      bg: '#000000',
      colors: {},
      settings: [],
    }

    const monacoTheme = textmateThemeToMonacoTheme(theme)
    expect(monacoTheme.base).toBe('hc-black')
  })
})
