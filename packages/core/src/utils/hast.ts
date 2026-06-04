import type { Element } from 'hast'

const RE_WHITESPACE = /\s+/g

/**
 * Utility to append class to a hast node
 *
 * If the `property.class` is a string, it will be splitted by space and converted to an array.
 */
export function addClassToHast(node: Element, className: string | string[]): Element {
  if (!className)
    return node
  node.properties ||= {}
  node.properties.class ||= []
  if (typeof node.properties.class === 'string')
    node.properties.class = node.properties.class.split(RE_WHITESPACE)
  if (!Array.isArray(node.properties.class))
    node.properties.class = []

  const list = node.properties.class as string[]
  const targets = Array.isArray(className) ? className : className.split(RE_WHITESPACE)
  // Build a Set once instead of doing O(n²) `.includes` for each new class.
  // The class array is typically tiny but `addClassToHast` is called per-token
  // by decoration transformers, so the constant matters.
  let seen: Set<string> | undefined
  for (const c of targets) {
    if (!c)
      continue
    if (!seen) {
      seen = new Set(list)
    }
    if (!seen.has(c)) {
      list.push(c)
      seen.add(c)
    }
  }
  return node
}
