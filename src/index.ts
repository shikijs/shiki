import type { BuiltinLanguages, BuiltinThemes, CodeToHtmlOptions, LanguageInput, ThemeInput } from './types'
import { bundledThemes } from './themes'
import { bundledLanguages, bundledLanguagesBase } from './langs'
import { getHighlighterCore } from './core'
import { getWasmInlined } from './wasm'

export * from './core'
export * from './themes'
export * from './langs'
export * from './wasm'

export interface HighlighterOptions {
  themes?: (ThemeInput | BuiltinThemes)[]
  langs?: (LanguageInput | BuiltinLanguages)[]
}

export type Highlighter = Awaited<ReturnType<typeof getHighlighter>>

export async function getHighlighter(options: HighlighterOptions = {}) {
  function resolveLang(lang: LanguageInput | BuiltinLanguages): LanguageInput {
    if (typeof lang === 'string') {
      const bundle = bundledLanguages[lang]
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

  const _themes = (options.themes ?? ['nord']).map(resolveTheme) as ThemeInput[]

  const langs = (options.langs ?? Object.keys(bundledLanguagesBase) as BuiltinLanguages[])
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
    loadLanguage(...langs: (LanguageInput | BuiltinLanguages)[]) {
      return core.loadLanguage(...langs.map(resolveLang))
    },
    loadTheme(...themes: (ThemeInput | BuiltinThemes)[]) {
      return core.loadTheme(...themes.map(resolveTheme))
    },
  }
}