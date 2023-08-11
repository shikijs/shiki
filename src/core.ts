import type { IOptions } from 'vscode-oniguruma'
import { createOnigScanner, createOnigString, loadWasm } from './oniguruma'
import { Registry } from './registry'
import type { CodeToHtmlOptions, LanguageInput, ThemeInput } from './types'
import { Resolver } from './resolver'
import { tokenizeWithTheme } from './themedTokenizer'
import { renderToHtml } from './renderer'
import { toShikiTheme } from './normalize'

export * from './types'

export interface CoreHighlighterOptions {
  themes: ThemeInput[]
  langs: LanguageInput[]
  loadWasm?: IOptions | (() => Promise<IOptions>)
}

export {
  loadWasm,
}

export async function getHighlighter(options: CoreHighlighterOptions) {
  const [
    themes,
    langs,
  ] = await Promise.all([
    Promise.all(options.themes.map(async t => toShikiTheme(typeof t === 'function' ? await t() : t))),
    Promise.all(options.langs.map(async t => typeof t === 'function' ? await t() : t)),
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

  const registry = new Registry(resolver, themes, langs)

  await registry.loadLanguages(langs)

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
    const _grammar = registry.getGrammar(lang)
    const { _theme, _colorMap } = getTheme(theme)
    return tokenizeWithTheme(_theme, _colorMap, code, _grammar, options)
  }

  function getTheme(name = defaultTheme) {
    const _theme = themes.find(i => i.name === name)!
    registry.setTheme(_theme)
    const _colorMap = registry.getColorMap()
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

  return {
    codeToThemedTokens,
    codeToHtml,
  }
}

function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text'].includes(lang)
}
