import type { HighlighterGeneric } from 'shikiji-core'
import { createSingletonShorthands, createdBundledHighlighter } from './core'
import type { BundledLanguage } from './assets/langs-bundle-web'
import type { BundledTheme } from './themes'
import { bundledLanguages } from './assets/langs-bundle-web'
import { bundledThemes } from './themes'
import { getWasmInlined } from './wasm'

export * from './core'
export * from './themes'
export * from './assets/langs-bundle-web'
export * from './wasm'

export type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

export const getHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
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
  BundledLanguage,
  BundledTheme
>(
  getHighlighter,
)
