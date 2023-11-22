import type { BuiltinLanguage, BuiltinTheme, HighlighterGeneric } from './types'
import { createSingletonShorthands, createdBundledHighlighter } from './core'
import { bundledLanguages } from './langs'
import { bundledThemes } from './themes'
import { getWasmInlined } from './wasm'

export * from './core'
export * from './themes'
export * from './langs'
export * from './wasm'

export type Highlighter = HighlighterGeneric<BuiltinLanguage, BuiltinTheme>

export const getHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BuiltinLanguage,
  BuiltinTheme
>(
  bundledLanguages,
  bundledThemes,
  getWasmInlined,
)

export const {
  codeToHtml,
  codeToHast,
  codeToThemedTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
} = /* @__PURE__ */ createSingletonShorthands<
  BuiltinLanguage,
  BuiltinTheme
>(
  getHighlighter,
)
