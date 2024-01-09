import type { HighlighterGeneric } from 'shikiji-core'
import { createSingletonShorthands, createdBundledHighlighter } from './core'
import type { BundledLanguage } from './assets/langs-bundle-full'
import type { BundledTheme } from './themes'
import { bundledLanguages } from './assets/langs-bundle-full'
import { bundledThemes } from './themes'
import { getWasmInlined } from './wasm'

export * from './core'
export * from './themes'
export * from './assets/langs-bundle-full'
export * from './wasm'

export type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

/**
 * Initiate a highlighter instance and load the specified languages and themes.
 * Later it can be used synchronously to highlight code.
 *
 * Importing this function will bundle all languages and themes.
 * @see https://shikiji.netlify.app/guide/bundles#shikiji-bundle-full
 *
 * For granular control over the bundle, check:
 * @see https://shikiji.netlify.app/guide/install#fine-grained-bundle
 */
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
