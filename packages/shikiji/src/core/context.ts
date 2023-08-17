import type { HighlighterCoreOptions, LanguageInput, MaybeGetter, ShikiContext, ThemeInput } from '../types'
import { createOnigScanner, createOnigString, loadWasm } from '../oniguruma'
import { Registry } from './registry'
import { Resolver } from './resolver'

/**
* Get the minimal shiki context for rendering.
*/
export async function getShikiContext(options: HighlighterCoreOptions = {}): Promise<ShikiContext> {
  async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
    return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
  }

  async function resolveLangs(langs: LanguageInput[]) {
    return Array.from(new Set((await Promise.all(
      langs.map(async lang => await normalizeGetter(lang).then(r => Array.isArray(r) ? r : [r])),
    )).flat()))
  }

  const [
    themes, langs,
  ] = await Promise.all([
    Promise.all((options.themes || []).map(normalizeGetter)),
    resolveLangs(options.langs || []),
    typeof options.loadWasm === 'function'
      ? Promise.resolve(options.loadWasm()).then(r => loadWasm(r))
      : options.loadWasm
        ? loadWasm(options.loadWasm)
        : undefined,
  ] as const)

  const resolver = new Resolver(Promise.resolve({
    createOnigScanner(patterns) {
      return createOnigScanner(patterns)
    },
    createOnigString(s) {
      return createOnigString(s)
    },
  }), 'vscode-oniguruma', langs)

  const _registry = new Registry(resolver, themes, langs)
  await _registry.init()

  function getLangGrammar(name: string) {
    const _lang = _registry.getGrammar(name)
    if (!_lang)
      throw new Error(`[shikiji] Language \`${name}\` not found, you may need to load it first`)
    return _lang
  }

  function getTheme(name: string) {
    const _theme = _registry.getTheme(name!)
    if (!_theme)
      throw new Error(`[shikiji] Theme \`${name}\` not found, you may need to load it first`)
    return _theme
  }

  function setTheme(name: string) {
    const theme = getTheme(name)
    _registry.setTheme(theme)
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

  return {
    setTheme,
    getTheme,
    getLangGrammar,
    getLoadedThemes,
    getLoadedLanguages,
    loadLanguage,
    loadTheme,
  }
}
