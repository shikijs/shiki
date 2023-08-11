import type { BuiltinLanguages, BuiltinThemes, LanguageInput, ThemeInput } from './types'
import { themes } from './vendor/themes'
import { languages } from './vendor/langs'
import { getHighlighter as getCoreHighlighter } from './core'

export * from './types'

export interface HighlighterOptions {
  themes?: (ThemeInput | BuiltinThemes)[]
  langs?: (LanguageInput | BuiltinLanguages)[]
}

let _onigurumaPromise: Promise<{ data: ArrayBuffer }> | null = null
export async function getWasmInlined(): Promise<{ data: ArrayBuffer }> {
  if (!_onigurumaPromise) {
    // @ts-expect-error anyway
    _onigurumaPromise = import('vscode-oniguruma/release/onig.wasm')
      .then(r => ({ data: r.default as ArrayBuffer }))
  }
  return _onigurumaPromise
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
