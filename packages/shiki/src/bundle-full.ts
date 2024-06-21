import type { CreateHighlighterFactory, HighlighterGeneric } from '@shikijs/core'
import { createSingletonShorthands, createdBundledHighlighter } from './core'
import type { BundledLanguage } from './assets/langs-bundle-full'
import type { BundledTheme } from './themes'
import { bundledLanguages } from './assets/langs-bundle-full'
import { bundledThemes } from './themes'
import { getWasmInlined } from './wasm-dynamic'

export * from './core'
export * from './themes'
export * from './assets/langs-bundle-full'

export { getWasmInlined }

export type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

/**
 * Initiate a highlighter instance and load the specified languages and themes.
 * Later it can be used synchronously to highlight code.
 *
 * Importing this function will bundle all languages and themes.
 * @see https://shiki.style/guide/bundles#shiki-bundle-full
 *
 * For granular control over the bundle, check:
 * @see https://shiki.style/guide/install#fine-grained-bundle
 */
export const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
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
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  getSingletonHighlighter,
} = /* @__PURE__ */ createSingletonShorthands<
  BundledLanguage,
  BundledTheme
>(
  createHighlighter,
)

/**
 * @deprecated Use `createHighlighter` or `getSingletonHighlighter` instead.
 */
export const getHighlighter: CreateHighlighterFactory<BundledLanguage, BundledTheme> = /* @__PURE__ */ (options) => {
  // TODO: next:  console.warn('`getHighlighter` is deprecated. Use `createHighlighter` or `getSingletonHighlighter` instead.')
  return createHighlighter(options)
}
