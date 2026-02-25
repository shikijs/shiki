import type {
  LanguageInput,
  LanguageRegistration,
  SpecialLanguage,
  SpecialTheme,
  ThemeInput,
  ThemeRegistrationResolved,
} from '@shikijs/types'

import { isSpecialLang, isSpecialTheme, normalizeGetter } from '../utils'
import { normalizeTheme } from './normalize-theme'

/**
 * Resolve
 */
export async function resolveLangs(langs: (LanguageInput | SpecialLanguage)[]): Promise<LanguageRegistration[]> {
  return Array.from(new Set((await Promise.all(
    langs
      .filter(l => !isSpecialLang(l))
      .map(async lang => await normalizeGetter(lang as LanguageInput).then(r => Array.isArray(r) ? r : [r])),
  )).flat()))
}

export async function resolveThemes(themes: (ThemeInput | SpecialTheme)[]): Promise<ThemeRegistrationResolved[]> {
  const resolved = await Promise.all(
    themes.map(async theme =>
      isSpecialTheme(theme)
        ? null
        : normalizeTheme(await normalizeGetter(theme)),
    ),
  )
  return resolved.filter(i => !!i)
}
