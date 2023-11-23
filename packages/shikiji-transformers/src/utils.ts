import type { Element } from 'hast'
import type { ShikijiTransformer, ShikijiTransformerContext } from 'shikiji'

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

          let replaced = false
          text.value = text.value.replace(regex, (...match) => {
            if (onMatch.call(this, match, line, child, lines, idx)) {
              replaced = true
              return ''
            }
            return match[0]
          })
          if (replaced && !text.value.trim())
            nodeToRemove = child
        }
        if (nodeToRemove)
          line.children.splice(line.children.indexOf(nodeToRemove), 1)
      })
    },
  }
}
