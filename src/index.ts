import type { BuiltinLanguages, BuiltinThemes, LanguageInput, ThemeInput } from './types'
import { themes } from './vendor/themes'
import { languages } from './vendor/langs'
import { getHighlighter as getCoreHighlighter } from './core'
import { loadWasm } from './oniguruma'
import { getWasmInlined } from './wasm'

export * from './types'

export {
  loadWasm,
  getWasmInlined,
}

export interface HighlighterOptions {
  themes?: (ThemeInput | BuiltinThemes)[]
  langs?: (LanguageInput | BuiltinLanguages)[]
}

export async function getHighlighter(options: HighlighterOptions = {}) {
  const _themes = (options.themes ?? ['nord']).map((i) => {
    if (typeof i === 'string')
      return themes[i]
    return i
  }) as ThemeInput[]

  const langs = (options.langs ?? Object.keys(languages) as BuiltinLanguages[])
    .map((i) => {
      if (typeof i === 'string')
        return languages[i]
      return i
    })

  return getCoreHighlighter({
    ...options,
    themes: _themes,
    langs,
    loadWasm: getWasmInlined,
  })
}
