import type { MaybeArray } from '../types'

export function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text', 'plain'].includes(lang)
}

export function toArray<T>(x: MaybeArray<T>): T[] {
  return Array.isArray(x) ? x : [x]
}

export function isSpecialLang(lang: string) {
  return lang === 'ansi' || isPlaintext(lang)
}
