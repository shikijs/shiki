import { bundledThemes } from '../themes'
import { bundledLanguages } from '../langs'
import { getHighlighterCore } from '../core'
import { getWasmInlined } from '../wasm'
import type { BuiltinLanguages, BuiltinThemes, CodeToHtmlOptions, LanguageInput, PlainTextLanguage, ThemeInput } from '../types'
import { isPlaintext } from '../core/utils'

export interface HighlighterOptions {
  themes?: (ThemeInput | BuiltinThemes)[]
  langs?: (LanguageInput | BuiltinLanguages | PlainTextLanguage)[]
}

export type Highlighter = Awaited<ReturnType<typeof getHighlighter>>

export async function getHighlighter(options: HighlighterOptions = {}) {
  function resolveLang(lang: LanguageInput | BuiltinLanguages | PlainTextLanguage): LanguageInput {
    if (typeof lang === 'string') {
      if (isPlaintext(lang))
        return []
      const bundle = bundledLanguages[lang as BuiltinLanguages]
      if (!bundle)
        throw new Error(`[shikiji] Language \`${lang}\` is not built-in.`)
      return bundle
    }
    return lang as LanguageInput
  }

  function resolveTheme(theme: ThemeInput | BuiltinThemes): ThemeInput {
    if (typeof theme === 'string') {
      const bundle = bundledThemes[theme]
      if (!bundle)
        throw new Error(`[shikiji] Theme \`${theme}\` is not built-in.`)
      return bundle
    }
    return theme
  }

  const _themes = (options.themes ?? []).map(resolveTheme) as ThemeInput[]

  const langs = (options.langs ?? [] as BuiltinLanguages[])
    .map(resolveLang)

  const core = await getHighlighterCore({
    ...options,
    themes: _themes,
    langs,
    loadWasm: getWasmInlined,
  })

  return {
    ...core,
    codeToHtml(code: string, options: CodeToHtmlOptions<BuiltinLanguages, BuiltinThemes> = {}) {
      return core.codeToHtml(code, options as CodeToHtmlOptions)
    },
    loadLanguage(...langs: (LanguageInput | BuiltinLanguages | PlainTextLanguage)[]) {
      return core.loadLanguage(...langs.map(resolveLang))
    },
    loadTheme(...themes: (ThemeInput | BuiltinThemes)[]) {
      return core.loadTheme(...themes.map(resolveTheme))
    },
  }
}
