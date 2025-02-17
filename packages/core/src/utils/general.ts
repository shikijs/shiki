import type {
  MaybeArray,
  MaybeGetter,
  PlainTextLanguage,
  SpecialLanguage,
  SpecialTheme,
  ThemeInput,
} from '@shikijs/types'

export function toArray<T>(x: MaybeArray<T>): T[] {
  return Array.isArray(x) ? x : [x]
}

/**
 * Normalize a getter to a promise.
 */
export async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
  return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
}

/**
 * Check if the language is plaintext that is ignored by Shiki.
 *
 * Hard-coded plain text languages: `plaintext`, `txt`, `text`, `plain`.
 */
export function isPlainLang(lang: string | null | undefined): lang is PlainTextLanguage {
  return !lang || ['plaintext', 'txt', 'text', 'plain'].includes(lang)
}

/**
 * Check if the language is specially handled or bypassed by Shiki.
 *
 * Hard-coded languages: `ansi` and plaintexts like `plaintext`, `txt`, `text`, `plain`.
 */
export function isSpecialLang(lang: any): lang is SpecialLanguage {
  return lang === 'ansi' || isPlainLang(lang)
}

/**
 * Check if the theme is specially handled or bypassed by Shiki.
 *
 * Hard-coded themes: `none`.
 */
export function isNoneTheme(theme: string | ThemeInput | null | undefined): theme is 'none' {
  return theme === 'none'
}

/**
 * Check if the theme is specially handled or bypassed by Shiki.
 *
 * Hard-coded themes: `none`.
 */
export function isSpecialTheme(theme: string | ThemeInput | null | undefined): theme is SpecialTheme {
  return isNoneTheme(theme)
}
