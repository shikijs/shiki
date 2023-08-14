import type { BuiltinLanguages, BuiltinThemes, HighlighterGeneric } from './types'
import { createSingletonShorthands, createdBundledHighlighter } from './core'
import { bundledLanguages } from './assets/langs'
import { bundledThemes } from './themes'
import { getWasmInlined } from './wasm'

export * from './core'
export * from './themes'
export * from './assets/langs'
export * from './wasm'

export type Highlighter = HighlighterGeneric<BuiltinLanguages, BuiltinThemes>

export const getHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BuiltinLanguages,
  BuiltinThemes
>(
  bundledLanguages,
  bundledThemes,
  getWasmInlined,
)

export const {
  codeToHtml,
  codeToHtmlDualThemes,
  codeToThemedTokens,
} = /* @__PURE__ */ createSingletonShorthands<
  BuiltinLanguages,
  BuiltinThemes
>(
  getHighlighter,
)
