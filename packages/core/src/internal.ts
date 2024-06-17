import type { HighlighterCoreOptions, LanguageInput, LanguageRegistration, MaybeGetter, ShikiInternal, SpecialLanguage, SpecialTheme, ThemeInput, ThemeRegistrationAny, ThemeRegistrationResolved } from './types'
import type { LoadWasmOptions } from './oniguruma'
import { createOnigScanner, createOnigString, loadWasm } from './oniguruma'
import { Registry } from './registry'
import { Resolver } from './resolver'
import { normalizeTheme } from './normalize'
import { isSpecialLang, isSpecialTheme } from './utils'
import { ShikiError } from './error'

let _defaultWasmLoader: LoadWasmOptions | undefined
/**
 * Set the default wasm loader for `loadWasm`.
 * @internal
 */
export function setDefaultWasmLoader(_loader: LoadWasmOptions) {
  _defaultWasmLoader = _loader
}

let instancesCount = 0

/**
 * Get the minimal shiki context for rendering.
 */
export async function getShikiInternal(options: HighlighterCoreOptions = {}): Promise<ShikiInternal> {
  instancesCount += 1
  if (options.warnings !== false && instancesCount >= 10 && instancesCount % 10 === 0)
    console.warn(`[Shiki] ${instancesCount} instances have been created. Shiki is supposed to be used as a singleton, consider refactoring your code to cache your highlighter instance.`)

  async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
    return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
  }

  async function resolveLangs(langs: (LanguageInput | SpecialLanguage)[]) {
    return Array.from(new Set((await Promise.all(
      langs
        .filter(l => !isSpecialLang(l))
        .map(async lang => await normalizeGetter(lang as LanguageInput).then(r => Array.isArray(r) ? r : [r])),
    )).flat()))
  }

  const wasmLoader = options.loadWasm || _defaultWasmLoader

  const [
    themes,
    langs,
  ] = await Promise.all([
    Promise.all((options.themes || []).map(normalizeGetter)).then(r => r.map(normalizeTheme)),
    resolveLangs(options.langs || []),
    wasmLoader ? loadWasm(wasmLoader) : undefined,
  ] as const)

  const resolver = new Resolver(
    Promise.resolve({
      createOnigScanner(patterns) {
        return createOnigScanner(patterns)
      },
      createOnigString(s) {
        return createOnigString(s)
      },
    }),
    langs,
  )

  const _registry = new Registry(resolver, themes, langs, options.langAlias)
  await _registry.init()

  let _lastTheme: string | ThemeRegistrationAny

  function getLanguage(name: string | LanguageRegistration) {
    const _lang = _registry.getGrammar(typeof name === 'string' ? name : name.name)
    if (!_lang)
      throw new ShikiError(`Language \`${name}\` not found, you may need to load it first`)
    return _lang
  }

  function getTheme(name: string | ThemeRegistrationAny): ThemeRegistrationResolved {
    if (name === 'none')
      return { bg: '', fg: '', name: 'none', settings: [], type: 'dark' }
    const _theme = _registry.getTheme(name)
    if (!_theme)
      throw new ShikiError(`Theme \`${name}\` not found, you may need to load it first`)
    return _theme
  }

  function setTheme(name: string | ThemeRegistrationAny) {
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

  function getLoadedThemes() {
    return _registry.getLoadedThemes()
  }

  function getLoadedLanguages() {
    return _registry.getLoadedLanguages()
  }

  async function loadLanguage(...langs: (LanguageInput | SpecialLanguage)[]) {
    await _registry.loadLanguages(await resolveLangs(langs))
  }

  async function loadTheme(...themes: (ThemeInput | SpecialTheme)[]) {
    await Promise.all(
      themes.map(async theme =>
        isSpecialTheme(theme)
          ? null
          : _registry.loadTheme(await normalizeGetter(theme)),
      ),
    )
  }

  return {
    setTheme,
    getTheme,
    getLanguage,
    getLoadedThemes,
    getLoadedLanguages,
    loadLanguage,
    loadTheme,
  }
}
