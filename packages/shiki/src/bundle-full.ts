import type { HighlighterGeneric } from '@shikijs/types'
import type {} from 'hast'
import type { BundledLanguage } from './langs-bundle-full'
import type { BundledTheme } from './themes'
import { createdBundledHighlighter, createSingletonShorthands } from './core'
import { createOnigurumaEngine } from './engine-oniguruma'
import { bundledLanguages } from './langs-bundle-full'
import { bundledThemes } from './themes'

export * from './core'
export * from './langs-bundle-full'
export * from './themes'

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
  engine: () => createOnigurumaEngine(import('shiki/wasm')),
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
