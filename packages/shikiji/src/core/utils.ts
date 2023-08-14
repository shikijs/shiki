import type { MaybeArray } from '../types'

export function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text'].includes(lang)
}

export function toArray<T>(x: MaybeArray<T>): T[] {
  return Array.isArray(x) ? x : [x]
}
