import type { Element } from 'hast'
import type { MaybeArray } from './types'

export function isPlaintext(lang: string | null | undefined) {
  return !lang || ['plaintext', 'txt', 'text', 'plain'].includes(lang)
}

export function toArray<T>(x: MaybeArray<T>): T[] {
  return Array.isArray(x) ? x : [x]
}

export function isSpecialLang(lang: string) {
  return lang === 'ansi' || isPlaintext(lang)
}

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
