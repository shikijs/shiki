/* Generate by @shikijs/codegen */
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from '@shikijs/types'
import { createdBundledHighlighter } from '@shikijs/core'
import { createJavaScriptRawEngine } from '@shikijs/engine-javascript/raw'

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
  javascript: () => import('@shikijs/langs-precompiled/javascript'),
  js: () => import('@shikijs/langs-precompiled/javascript'),
  cjs: () => import('@shikijs/langs-precompiled/javascript'),
  mjs: () => import('@shikijs/langs-precompiled/javascript'),
  typescript: () => import('@shikijs/langs-precompiled/typescript'),
  ts: () => import('@shikijs/langs-precompiled/typescript'),
  cts: () => import('@shikijs/langs-precompiled/typescript'),
  mts: () => import('@shikijs/langs-precompiled/typescript'),
  tsx: () => import('@shikijs/langs-precompiled/tsx'),
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
  engine: () => createJavaScriptRawEngine(),
})

export { bundledLanguages, bundledThemes, createHighlighter }
export type { BundledLanguage, BundledTheme, Highlighter }
