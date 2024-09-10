import type { CreateHighlighterFactory, HighlighterGeneric } from '@shikijs/types'
import type {} from 'hast'
import { bundledLanguages } from './assets/langs-bundle-full'
import { createdBundledHighlighter, createSingletonShorthands, createWasmOnigEngine } from './core'
import { bundledThemes } from './themes'
import { getWasmInlined } from './wasm-dynamic'
import type { BundledLanguage } from './assets/langs-bundle-full'
import type { BundledTheme } from './themes'

export * from './assets/langs-bundle-full'
export * from './core'
export * from './themes'

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
 * @see https://shiki.style/guide/bundles#fine-grained-bundle
 */
export const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createWasmOnigEngine(getWasmInlined),
})

export const {
  codeToHtml,
  codeToHast,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
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
