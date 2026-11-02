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

  const targets = Array.isArray(className)
    ? className
    : className.split(RE_WHITESPACE)
  for (const c of targets) {
    if (c && !node.properties.class.includes(c))
      node.properties.class.push(c)
  }
  return node
}
