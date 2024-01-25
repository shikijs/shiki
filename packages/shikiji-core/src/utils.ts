import type { Element } from 'hast'
import type { MaybeArray, SpecialTheme, ThemeInput, ThemedToken } from './types'

export function toArray<T>(x: MaybeArray<T>): T[] {
  return Array.isArray(x) ? x : [x]
}

/**
 * Slipt a string into lines, each line preserves the line ending.
 */
export function splitLines(str: string) {
  return Array.from(str.matchAll(/^.*$/mg)).map(x => [x[0], x.index!] as [code: string, offset: number])
}

/**
 * Check if the language is plaintext that is ignored by Shikiji.
 *
 * Hard-coded plain text languages: `plaintext`, `txt`, `text`, `plain`.
 */
export function isPlainLang(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text', 'plain'].includes(lang)
}

/**
 * Check if the language is specially handled or bypassed by Shikiji.
 *
 * Hard-coded languages: `ansi` and plaintexts like `plaintext`, `txt`, `text`, `plain`.
 */
export function isSpecialLang(lang: string) {
  return lang === 'ansi' || isPlainLang(lang)
}

/**
 * Check if the theme is specially handled or bypassed by Shikiji.
 *
 * Hard-coded themes: `none`.
 */
export function isNoneTheme(theme: string | ThemeInput | null | undefined): theme is 'none' {
  return theme === 'none'
}

/**
 * Check if the theme is specially handled or bypassed by Shikiji.
 *
 * Hard-coded themes: `none`.
 */
export function isSpecialTheme(theme: string | ThemeInput | null | undefined): theme is SpecialTheme {
  return isNoneTheme(theme)
}

/**
 * Utility to append class to a hast node
 *
 * If the `property.class` is a string, it will be splitted by space and converted to an array.
 */
export function addClassToHast(node: Element, className: string | string[]) {
  if (!className)
    return
  node.properties ||= {}
  node.properties.class ||= []
  if (typeof node.properties.class === 'string')
    node.properties.class = node.properties.class.split(/\s+/g)
  if (!Array.isArray(node.properties.class))
    node.properties.class = []

  const targets = Array.isArray(className) ? className : className.split(/\s+/g)
  for (const c of targets) {
    if (c && !node.properties.class.includes(c))
      node.properties.class.push(c)
  }
}

/**
 * Split a token into multiple tokens by given offsets.
 *
 * The offsets are relative to the token, and should be sorted.
 */
export function splitToken<
  T extends Pick<ThemedToken, 'content' | 'offset'>,
>(
  token: T,
  offsets: number[],
): T[] {
  let lastOffset = 0
  const tokens: T[] = []

  for (const offset of offsets) {
    if (offset > lastOffset) {
      tokens.push({
        ...token,
        content: token.content.slice(lastOffset, offset),
        offset: token.offset + lastOffset,
      })
    }
    lastOffset = offset
  }

  if (lastOffset < token.content.length) {
    tokens.push({
      ...token,
      content: token.content.slice(lastOffset),
      offset: token.offset + lastOffset,
    })
  }

  return tokens
}

export function applyColorReplacements(color: string, replacements?: Record<string, string>): string {
  return replacements?.[color.toLowerCase()] || color
}

/**
 * @deprecated Use `isPlainLang` instead.
 */
export const isPlaintext = isPlainLang
