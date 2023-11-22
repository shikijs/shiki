import type { Element } from 'hast'
import type { ShikijiTransformer, ShikijiTransformerContext } from 'shikiji'

/**
 * Check if a node is comment-like,
 * e.g. `<!-- comment -->`, `/* comment ..`, `// comment`
 */
export function isCommentLike(node: Element, line: Element) {
  if (node.children?.[0].type !== 'text')
    return false
  const text = node.children[0].value.trim()
  if (text.startsWith('<!--') && text.endsWith('-->'))
    return true
  if (text.startsWith('/*') && text.endsWith('*/'))
    return true
  if (text.startsWith('//') && line.children.indexOf(node) === line.children.length - 1)
    return true
  return false
}

export function createCommentNotationTransformer(
  name: string,
  regex: RegExp,
  onMatch: (this: ShikijiTransformerContext, match: RegExpMatchArray, line: Element, commentNode: Element) => boolean,
): ShikijiTransformer {
  return {
    name,
    line(line) {
      let nodeToRemove: Element | undefined
      for (const child of line.children) {
        if (child.type !== 'element')
          continue
        if (!isCommentLike(child, line))
          continue
        const text = child.children[0]
        if (text.type !== 'text')
          continue
        const match = text.value.match(regex)
        if (!match)
          continue
        if (onMatch.call(this, match, line, child)) {
          nodeToRemove = child
          break
        }
      }
      if (nodeToRemove)
        line.children.splice(line.children.indexOf(nodeToRemove), 1)
    },
  }
}
