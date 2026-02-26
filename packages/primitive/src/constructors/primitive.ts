import type {
  Grammar,
  HighlighterCoreOptions,
  LanguageInput,
  LanguageRegistration,
  MaybeArray,
  ShikiPrimitive,
  SpecialLanguage,
  SpecialTheme,
  ThemeInput,
  ThemeRegistrationAny,
  ThemeRegistrationResolved,
} from '@shikijs/types'
import { ShikiError } from '@shikijs/types'
import { resolveLangs, resolveThemes } from '../textmate/getters-resolve'
import { normalizeTheme } from '../textmate/normalize-theme'
import { Registry } from '../textmate/registry'
import { Resolver } from '../textmate/resolver'
import { resolveLangAlias as _resolveLangAlias } from '../utils/alias'

let instancesCount = 0

/**
 * Get the minimal shiki primitive instance.
 *
 * Requires to provide the engine and all themes and languages upfront.
 */
export function createShikiPrimitive(options: HighlighterCoreOptions<true>): ShikiPrimitive {
  instancesCount += 1
  if (options.warnings !== false && instancesCount >= 10 && instancesCount % 10 === 0)
    console.warn(`[Shiki] ${instancesCount} instances have been created. Shiki is supposed to be used as a singleton, consider refactoring your code to cache your highlighter instance; Or call \`highlighter.dispose()\` to release unused instances.`)

  let isDisposed = false

  if (!options.engine)
    throw new ShikiError('`engine` option is required for synchronous mode')

  const langs = (options.langs || []).flat(1)
  const themes = (options.themes || []).flat(1).map(normalizeTheme)

  const resolver = new Resolver(options.engine, langs)
  const _registry = new Registry(resolver, themes, langs, options.langAlias)

  let _lastTheme: string | ThemeRegistrationAny

  function resolveLangAlias(name: string): string {
    return _resolveLangAlias(name, options.langAlias)
  }

  function getLanguage(name: string | LanguageRegistration): Grammar {
    ensureNotDisposed()
    const _lang = _registry.getGrammar(typeof name === 'string' ? name : name.name)
    if (!_lang)
      throw new ShikiError(`Language \`${name}\` not found, you may need to load it first`)
    return _lang
  }

  function getTheme(name: string | ThemeRegistrationAny): ThemeRegistrationResolved {
    if (name === 'none')
      return { bg: '', fg: '', name: 'none', settings: [], type: 'dark' }
    ensureNotDisposed()
    const _theme = _registry.getTheme(name)
    if (!_theme)
      throw new ShikiError(`Theme \`${name}\` not found, you may need to load it first`)
    return _theme
  }

  function setTheme(name: string | ThemeRegistrationAny): {
    theme: ThemeRegistrationResolved
    colorMap: string[]
  } {
    ensureNotDisposed()
    const theme = getTheme(name)
    if (_lastTheme !== name) {
      _registry.setTheme(theme)
      _lastTheme = name
    }
    const colorMap = _registry.getColorMap()
    return {
      theme,
      colorMap,
    }
  }

  function getLoadedThemes(): string[] {
    ensureNotDisposed()
    return _registry.getLoadedThemes()
  }

  function getLoadedLanguages(): string[] {
    ensureNotDisposed()
    return _registry.getLoadedLanguages()
  }

  function loadLanguageSync(...langs: MaybeArray<LanguageRegistration>[]): void {
    ensureNotDisposed()
    _registry.loadLanguages(langs.flat(1))
  }

  async function loadLanguage(...langs: (LanguageInput | SpecialLanguage)[]): Promise<void> {
    return loadLanguageSync(await resolveLangs(langs))
  }

  function loadThemeSync(...themes: MaybeArray<ThemeRegistrationAny>[]): void {
    ensureNotDisposed()
    for (const theme of themes.flat(1)) {
      _registry.loadTheme(theme)
    }
  }

  async function loadTheme(...themes: (ThemeInput | SpecialTheme)[]): Promise<void> {
    ensureNotDisposed()
    return loadThemeSync(await resolveThemes(themes))
  }

  function ensureNotDisposed(): void {
    if (isDisposed)
      throw new ShikiError('Shiki instance has been disposed')
  }

  function dispose(): void {
    if (isDisposed)
      return
    isDisposed = true
    _registry.dispose()
    instancesCount -= 1
  }

  return {
    setTheme,
    getTheme,
    getLanguage,
    getLoadedThemes,
    getLoadedLanguages,
    resolveLangAlias,
    loadLanguage,
    loadLanguageSync,
    loadTheme,
    loadThemeSync,
    dispose,
    [Symbol.dispose]: dispose,
  }
}

/**
 * @deprecated Use `createShikiPrimitive` instead.
 */
export const createShikiInternalSync = createShikiPrimitive
