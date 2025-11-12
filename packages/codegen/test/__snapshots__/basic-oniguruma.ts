/* Generate by @shikijs/codegen */
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from '@shikijs/types'
import {
  createSingletonShorthands,
  createdBundledHighlighter,
} from '@shikijs/core'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'

type BundledLanguage =
  | 'javascript'
  | 'js'
  | 'cjs'
  | 'mjs'
  | 'typescript'
  | 'ts'
  | 'cts'
  | 'mts'
  | 'tsx'
type BundledTheme = 'nord' | 'vitesse-dark'
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

const bundledLanguages = {
  javascript: () => import('@shikijs/langs/javascript'),
  js: () => import('@shikijs/langs/javascript'),
  cjs: () => import('@shikijs/langs/javascript'),
  mjs: () => import('@shikijs/langs/javascript'),
  typescript: () => import('@shikijs/langs/typescript'),
  ts: () => import('@shikijs/langs/typescript'),
  cts: () => import('@shikijs/langs/typescript'),
  mts: () => import('@shikijs/langs/typescript'),
  tsx: () => import('@shikijs/langs/tsx'),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>

const bundledThemes = {
  nord: () => import('@shikijs/themes/nord'),
  'vitesse-dark': () => import('@shikijs/themes/vitesse-dark'),
} as Record<BundledTheme, DynamicImportThemeRegistration>

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createOnigurumaEngine(import('shiki/wasm')),
})

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(
  createHighlighter,
)

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
}
export type { BundledLanguage, BundledTheme, Highlighter }
