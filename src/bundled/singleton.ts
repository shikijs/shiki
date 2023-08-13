import type { BuiltinLanguages, BuiltinThemes, CodeToHtmlOptions, CodeToThemedTokensOptions, PlainTextLanguage, RequireKeys } from '../types'
import { getHighlighter } from './highlighter'
import type { Highlighter } from './highlighter'

let _shiki: Promise<Highlighter>

async function getShikiWithThemeLang(options: { theme: BuiltinThemes; lang: BuiltinLanguages | PlainTextLanguage }) {
  if (!_shiki) {
    _shiki = getHighlighter({
      themes: [options.theme],
      langs: [options.lang],
    })
    return _shiki
  }
  else {
    const s = await _shiki
    await Promise.all([
      s.loadTheme(options.theme),
      s.loadLanguage(options.lang),
    ])
    return s
  }
}

/**
 * Shorthand for `codeToHtml` with auto-loaded theme and language.
 * A singleton highlighter it maintained internally.
 *
 * Differences from `shiki.codeToHtml()`, this function is async.
 */
export async function codeToHtml(code: string, options: RequireKeys<CodeToHtmlOptions<BuiltinLanguages, BuiltinThemes>, 'theme' | 'lang'>) {
  const shiki = await getShikiWithThemeLang(options)
  return shiki.codeToHtml(code, options)
}

/**
 * Shorthand for `codeToThemedTokens` with auto-loaded theme and language.
 * A singleton highlighter it maintained internally.
 *
 * Differences from `shiki.codeToThemedTokens()`, this function is async.
 */
export async function codeToThemedTokens(code: string, options: RequireKeys<CodeToThemedTokensOptions<BuiltinLanguages, BuiltinThemes>, 'theme' | 'lang'>) {
  const shiki = await getShikiWithThemeLang(options)
  return shiki.codeToThemedTokens(code, options)
}
