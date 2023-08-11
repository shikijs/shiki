import type { BuiltinLanguages, BuiltinThemes, LanguageInput, ThemeInput } from './types'
import { bundledThemes } from './vendor/themes'
import { bundledLanguages } from './vendor/langs'
import { getHighlighterCore } from './core'
import { getWasmInlined } from './wasm'

export * from './core'

export {
  getWasmInlined,
  bundledLanguages,
  bundledThemes,
}

export interface HighlighterOptions {
  themes?: (ThemeInput | BuiltinThemes)[]
  langs?: (LanguageInput | BuiltinLanguages)[]
}

export async function getHighlighter(options: HighlighterOptions = {}) {
  const _themes = (options.themes ?? ['nord']).map((i) => {
    if (typeof i === 'string')
      return bundledThemes[i]
    return i
  }) as ThemeInput[]

  const langs = (options.langs ?? Object.keys(bundledLanguages) as BuiltinLanguages[])
    .map((i) => {
      if (typeof i === 'string')
        return bundledLanguages[i]
      return i
    })

  return getHighlighterCore({
    ...options,
    themes: _themes,
    langs,
    loadWasm: getWasmInlined,
  })
}
