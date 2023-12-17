import type { LanguageRegistration, ThemeRegistration } from 'shikiji-core'

export function objectPick<T extends Record<any, any>>(
  obj: T,
  keys: (keyof T)[],
  onRemoval?: (obj: T, key: string, value: any) => void,
): T {
  return Object.fromEntries(
    Array.from(
      Object.entries(obj)
        .filter((i) => {
          if (keys.includes(i[0]))
            return true
          onRemoval?.(obj, ...i)
          return false
        }),
    ),
  ) as T
}

export function cleanupLanguageReg(lang: LanguageRegistration) {
  return objectPick(
    lang,
    [
      'aliases',
      'balancedBracketSelectors',
      'displayName',
      'embeddedLangs',
      'fileTypes',
      'firstLineMatch',
      'injections',
      'injectionSelector',
      'injectTo',
      'name',
      'patterns',
      'repository',
      'scopeName',
      'foldingStopMarker',
      'foldingStartMarker',
      'unbalancedBracketSelectors',
    ],
    // (_, key, value) => console.log('lang key removal', key, '|', value),
  )
}

export function cleanupThemeReg(theme: ThemeRegistration) {
  return objectPick(
    theme,
    [
      'name',
      'type',
      'colors',
      'fg',
      'bg',
      'include',
      'settings',

      'tokenColors',
      'semanticHighlighting',
      'semanticTokenColors',
    ],
    // (_, key, value) => console.log('theme key removal', key, value),
  )
}
