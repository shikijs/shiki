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

/**
 * Apply color replacements to every entry of a colorMap once, producing a
 * parallel array indexed by foreground id. Lets the per-token tokenize loop
 * avoid calling {@link applyColorReplacements} (which `.toLowerCase()`s the
 * color string) on every token.
 *
 * When `replacements` is empty/undefined this short-circuits to the input
 * array so we don't allocate a copy in the common case.
 */
export function resolveColorMap(
  colorMap: string[],
  replacements?: Record<string, string | undefined>,
): string[] {
  if (!replacements || !hasOwnKeys(replacements))
    return colorMap

  const out: string[] = Array.from({ length: colorMap.length })
  for (let i = 0; i < colorMap.length; i++) {
    const color = colorMap[i]
    out[i] = color ? (replacements[color.toLowerCase()] || color) : color
  }
  return out
}

function hasOwnKeys(obj: Record<string, unknown>): boolean {
  // Cheaper than `Object.keys(obj).length > 0` because it doesn't allocate
  // the intermediate array — for `for-in` we only need to know if the
  // iterator produces a value at all.
  // eslint-disable-next-line no-unreachable-loop -- intentional first-step probe
  for (const _ in obj)
    return true
  return false
}
