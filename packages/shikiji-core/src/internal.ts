import type { HighlighterCoreOptions, LanguageInput, MaybeGetter, ShikiInternal, ThemeInput, ThemeRegistrationResolved } from './types'
import type { LoadWasmOptions } from './oniguruma'
import { createOnigScanner, createOnigString, loadWasm } from './oniguruma'
import { Registry } from './registry'
import { Resolver } from './resolver'
import { normalizeTheme } from './normalize'

let _defaultWasmLoader: LoadWasmOptions | undefined
/**
 * Set the default wasm loader for `loadWasm`.
 * @internal
 */
export function setDefaultWasmLoader(_loader: LoadWasmOptions) {
  _defaultWasmLoader = _loader
}

/**
 * Get the minimal shiki context for rendering.
 */
export async function getShikiInternal(options: HighlighterCoreOptions = {}): Promise<ShikiInternal> {
  async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
    return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
  }

  async function resolveLangs(langs: LanguageInput[]) {
    return Array.from(new Set((await Promise.all(
      langs.map(async lang => await normalizeGetter(lang).then(r => Array.isArray(r) ? r : [r])),
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

  const _registry = new Registry(resolver, themes, langs)
  Object.assign(_registry.alias, options.langAlias)
  await _registry.init()

  let _lastTheme: string | ThemeRegistrationResolved

  function getLangGrammar(name: string) {
    const _lang = _registry.getGrammar(name)
    if (!_lang)
      throw new Error(`[shikiji] Language \`${name}\` not found, you may need to load it first`)
    return _lang
  }

  function getTheme(name: string | ThemeRegistrationResolved) {
    const _theme = _registry.getTheme(name)
    if (!_theme)
      throw new Error(`[shikiji] Theme \`${name}\` not found, you may need to load it first`)
    return _theme
  }

  function setTheme(name: string | ThemeRegistrationResolved) {
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

  async function loadLanguage(...langs: LanguageInput[]) {
    await _registry.loadLanguages(await resolveLangs(langs))
  }

  async function loadTheme(...themes: ThemeInput[]) {
    await Promise.all(
      themes.map(async theme => _registry.loadTheme(await normalizeGetter(theme))),
    )
  }

  function updateAlias(alias: Record<string, string>) {
    Object.assign(_registry.alias, alias)
  }

  function getAlias() {
    return _registry.alias
  }

  return {
    setTheme,
    getTheme,
    getLangGrammar,
    getLoadedThemes,
    getLoadedLanguages,
    getAlias,
    updateAlias,
    loadLanguage,
    loadTheme,
  }
}
