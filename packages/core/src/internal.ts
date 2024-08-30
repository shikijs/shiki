import type { HighlighterCoreOptions, LanguageInput, LanguageRegistration, LoadWasmOptions, MaybeGetter, ShikiInternal, SpecialLanguage, SpecialTheme, ThemeInput, ThemeRegistrationAny, ThemeRegistrationResolved } from './types'
import { Registry } from './registry'
import { Resolver } from './resolver'
import { normalizeTheme } from './normalize'
import { isSpecialLang, isSpecialTheme } from './utils'
import { ShikiError } from './error'
import { createWasmOnigEngine } from './engines/wasm'

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
export async function createShikiInternal(options: HighlighterCoreOptions = {}): Promise<ShikiInternal> {
  instancesCount += 1
  if (options.warnings !== false && instancesCount >= 10 && instancesCount % 10 === 0)
    console.warn(`[Shiki] ${instancesCount} instances have been created. Shiki is supposed to be used as a singleton, consider refactoring your code to cache your highlighter instance; Or call \`highlighter.dispose()\` to release unused instances.`)

  let isDisposed = false

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

  const [
    themes,
    langs,
  ] = await Promise.all([
    Promise.all((options.themes || []).map(normalizeGetter)).then(r => r.map(normalizeTheme)),
    resolveLangs(options.langs || []),
  ] as const)

  const resolver = new Resolver(
    Promise.resolve(options.engine || createWasmOnigEngine(options.loadWasm || _defaultWasmLoader)),
    langs,
  )

  const _registry = new Registry(resolver, themes, langs, options.langAlias)
  await _registry.init()

  let _lastTheme: string | ThemeRegistrationAny

  function getLanguage(name: string | LanguageRegistration) {
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

  function setTheme(name: string | ThemeRegistrationAny) {
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

  function getLoadedThemes() {
    ensureNotDisposed()
    return _registry.getLoadedThemes()
  }

  function getLoadedLanguages() {
    ensureNotDisposed()
    return _registry.getLoadedLanguages()
  }

  async function loadLanguage(...langs: (LanguageInput | SpecialLanguage)[]) {
    ensureNotDisposed()
    await _registry.loadLanguages(await resolveLangs(langs))
  }

  async function loadTheme(...themes: (ThemeInput | SpecialTheme)[]) {
    ensureNotDisposed()
    await Promise.all(
      themes.map(async theme =>
        isSpecialTheme(theme)
          ? null
          : _registry.loadTheme(await normalizeGetter(theme)),
      ),
    )
  }

  function ensureNotDisposed() {
    if (isDisposed)
      throw new ShikiError('Shiki instance has been disposed')
  }

  function dispose() {
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
    loadLanguage,
    loadTheme,
    dispose,
    [Symbol.dispose]: dispose,
  }
}

/**
 * @deprecated Use `createShikiInternal` instead.
 */
export function getShikiInternal(options: HighlighterCoreOptions = {}): Promise<ShikiInternal> {
  // TODO: next: console.warn('`getShikiInternal` is deprecated. Use `createShikiInternal` instead.')
  return createShikiInternal(options)
}
