import vitesseLight from '@shikijs/themes/vitesse-light'
import { describe, expect, it } from 'vitest'
import { textmateThemeToMonacoTheme } from '../src/index'

describe('textmateThemeToMonacoTheme preserves fontStyle on styled scopes', () => {
  it('includes bold/italic rules for markup scopes (e.g., markdown)', () => {
    const monacoTheme = textmateThemeToMonacoTheme(vitesseLight as any)

    const styledRules = (monacoTheme.rules || [])
      .filter(r => typeof r.fontStyle === 'string' && r.fontStyle.length > 0)

    // Expect at least one styled rule for common markdown-related scopes
    const hasBold = styledRules.some(r => /markup/.test(String(r.token)) && /bold/.test(String(r.fontStyle)))
    const hasItalic = styledRules.some(r => /markup/.test(String(r.token)) && /italic/.test(String(r.fontStyle)))

    expect(hasBold || hasItalic).toBe(true)
  })
})
