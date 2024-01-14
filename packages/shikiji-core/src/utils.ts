import type { Element } from 'hast'
import type { MaybeArray } from './types'

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
 * Hard-coded languages: `plaintext`, `txt`, `text`, `plain`.
 */
export function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text', 'plain'].includes(lang)
}

/**
 * Check if the language is specially handled by Shikiji.
 *
 * Hard-coded languages: `ansi` and plaintexts like `plaintext`, `txt`, `text`, `plain`.
 */
export function isSpecialLang(lang: string) {
  return lang === 'ansi' || isPlaintext(lang)
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

export function applyColorReplacements(color: string, replacements?: Record<string, string>): string {
  return replacements?.[color.toLowerCase()] || color
}
