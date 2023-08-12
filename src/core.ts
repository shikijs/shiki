import type { CodeToHtmlOptions, LanguageInput, MaybeGetter, ThemeInput } from './types'
import type { OnigurumaLoadOptions } from './oniguruma'
import { createOnigScanner, createOnigString, loadWasm } from './oniguruma'
import { Registry } from './registry'
import { Resolver } from './resolver'
import { tokenizeWithTheme } from './themedTokenizer'
import { renderToHtml } from './renderer'

export * from './types'

export interface HighlighterCoreOptions {
  themes: ThemeInput[]
  langs: LanguageInput[]
  loadWasm?: OnigurumaLoadOptions | (() => Promise<OnigurumaLoadOptions>)
}

export type HighlighterCore = Awaited<ReturnType<typeof getHighlighterCore>>

export {
  loadWasm,
}

export async function getHighlighterCore(options: HighlighterCoreOptions) {
  const [
    themes,
    langs,
  ] = await Promise.all([
    Promise.all(options.themes.map(normalizeGetter)),
    Promise.all(options.langs.map(normalizeGetter)),
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

  const defaultTheme = themes[0].name

  function codeToThemedTokens(
    code: string,
    lang = 'text',
    theme = defaultTheme,
    options = { includeExplanation: true },
  ) {
    if (isPlaintext(lang)) {
      const lines = code.split(/\r\n|\r|\n/)
      return [...lines.map(line => [{ content: line }])]
    }
    const _grammar = getLang(lang)
    const { _theme, _colorMap } = getTheme(theme)
    return tokenizeWithTheme(_theme, _colorMap, code, _grammar, options)
  }

  function getLang(name: string) {
    const _lang = _registry.getGrammar(name)
    if (!_lang)
      throw new Error(`[shiki] Language \`${name}\` not found`)
    return _lang
  }

  function getTheme(name = defaultTheme) {
    const _theme = _registry.getTheme(name!)
    if (!_theme)
      throw new Error(`[shiki] Theme \`${name}\` not found`)
    _registry.setTheme(_theme)
    const _colorMap = _registry.getColorMap()
    return {
      _theme,
      _colorMap,
    }
  }

  function codeToHtml(code: string, options: CodeToHtmlOptions = {}): string {
    const tokens = codeToThemedTokens(code, options.lang, options.theme, {
      includeExplanation: false,
    })
    const { _theme } = getTheme(options.theme)
    return renderToHtml(tokens, {
      fg: _theme.fg,
      bg: _theme.bg,
      lineOptions: options?.lineOptions,
      themeName: _theme.name,
    })
  }

  async function loadLanguage(...langs: LanguageInput[]) {
    await _registry.loadLanguages(
      await Promise.all(
        langs.map(async lang => await normalizeGetter(lang)),
      ),
    )
  }

  async function loadTheme(...themes: ThemeInput[]) {
    await Promise.all(
      themes.map(async theme =>
        _registry.loadTheme(await normalizeGetter(theme)),
      ),
    )
  }

  return {
    codeToThemedTokens,
    codeToHtml,
    loadLanguage,
    loadTheme,
    getLoadedThemes: () => _registry.getLoadedThemes(),
    getLoadedLanguages: () => _registry.getLoadedLanguages(),
  }
}

function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text'].includes(lang)
}

async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
  return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
}
