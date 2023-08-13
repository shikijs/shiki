export function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text'].includes(lang)
}
