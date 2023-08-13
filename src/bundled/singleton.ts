import type { BuiltinLanguages, BuiltinThemes, CodeToHtmlOptions, PlainTextLanguage, RequireKeys } from '../types'
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
 * Shorthand for codeToHtml with auto-loaded theme and language.
 * A singleton highlighter it maintained internally.
 *
 * Differences from `shiki.codeToHtml()`, this function is async.
 */
export async function codeToHtml(code: string, options: RequireKeys<CodeToHtmlOptions<BuiltinLanguages, BuiltinThemes>, 'theme' | 'lang'>) {
  const shiki = await getShikiWithThemeLang(options)
  return shiki.codeToHtml(code, options)
}
