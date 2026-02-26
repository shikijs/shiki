import type { ThemeRegistrationAny, TokenizeWithThemeOptions } from '@shikijs/types'

export function resolveColorReplacements(
  theme: ThemeRegistrationAny | string,
  options?: TokenizeWithThemeOptions,
): Record<string, string | undefined> {
  const replacements = typeof theme === 'string' ? {} : { ...theme.colorReplacements }
  const themeName = typeof theme === 'string' ? theme : theme.name
  for (const [key, value] of Object.entries(options?.colorReplacements || {})) {
    if (typeof value === 'string')
      replacements[key] = value
    else if (key === themeName)
      Object.assign(replacements, value)
  }
  return replacements
}

export function applyColorReplacements(color: string, replacements?: Record<string, string | undefined>): string
export function applyColorReplacements(color?: string | undefined, replacements?: Record<string, string | undefined>): string | undefined
export function applyColorReplacements(color?: string, replacements?: Record<string, string | undefined>): string | undefined {
  if (!color)
    return color
  return replacements?.[color?.toLowerCase()] || color
}
