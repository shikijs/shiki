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
  onMatch: (
    this: ShikijiTransformerContext,
    match: string[],
    line: Element,
    commentNode: Element,
    lines: Element[],
    index: number,
  ) => boolean,
): ShikijiTransformer {
  return {
    name,
    code(code) {
      const lines = code.children.filter(i => i.type === 'element') as Element[]
      lines.forEach((line, idx) => {
        let nodeToRemove: Element | undefined
        for (const child of line.children) {
          if (child.type !== 'element')
            continue
          const text = child.children[0]
          if (text.type !== 'text')
            continue

          text.value = text.value.replace(regex, (...match) => {
            if (onMatch.call(this, match, line, child, lines, idx))
              return ''
            return match[0]
          })
          if (!text.value.trim())
            nodeToRemove = child
        }
        if (nodeToRemove)
          line.children.splice(line.children.indexOf(nodeToRemove), 1)
      })
    },
  }
}
