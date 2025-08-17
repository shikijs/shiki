import type { Element } from 'hast'

/**
 * Utility to append class to a hast node
 *
 * If the `property.className` is a string, it will be splitted by space and converted to an array.
 */
export function addClassToHast(node: Element, className: string | string[]): Element {
  if (!className)
    return node
  node.properties ||= {}
  node.properties.className ||= []
  if (typeof node.properties.className === 'string')
    node.properties.className = node.properties.className.split(/\s+/g)
  if (!Array.isArray(node.properties.className))
    node.properties.className = []

  const targets = Array.isArray(className) ? className : className.split(/\s+/g)
  for (const c of targets) {
    if (c && !node.properties.className.includes(c))
      node.properties.className.push(c)
  }
  return node
}
