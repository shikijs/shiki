import type { Element, Text } from 'hast'
import type { ShikiTransformer, ShikiTransformerContext } from 'shiki'

/**
 * Regex that matches code comments
 */
const regex = /\s*(?:\/\/|\/\*|<!--|[#"']|--|%{1,2}|;{1,2})(.+?)(?=-->|\*\/|$)/

/**
 * Create a transformer to process comment notations
 *
 * @param name transformer name
 * @param onMatch function to be called when found a comment in code, remove the comment node if returns `true`.
 * @param removeEmptyLines remove empty lines below if matched
 */
export function createCommentNotationTransformer(
  name: string,
  onMatch: (
    this: ShikiTransformerContext,
    commentText: string,
    line: Element,
    commentNode: Element,
    lines: Element[],
    index: number,
  ) => boolean,
  removeEmptyLines = false,
): ShikiTransformer {
  return {
    name,
    code(code) {
      const lines = code.children.filter(i => i.type === 'element') as Element[]
      const linesToRemove: (Element | Text)[] = []

      lines.forEach((line, lineIdx) => {
        // comment should be at the end of line (last token)
        const last = (line.children.filter(i => i.type === 'element') as Element[]).at(-1)

        if (!last)
          return
        const text = last.children[0]
        if (text.type !== 'text')
          return

        const match = regex.exec(text.value)
        if (!match)
          return

        // rest of the comment token
        const rest = text.value.slice(0, match.index).trim()
        // no other tokens except the comment
        const isEmptyLine = line.children.length === 1
        const isRemoved = onMatch.call(this, match[1], line, last, lines,
          // take the next line if the current line will be removed
          isEmptyLine ? lineIdx + 1 : lineIdx)

        if (!isRemoved)
          return
        if (rest.length > 0) {
          text.value = rest
          return
        }

        line.children.splice(line.children.indexOf(last), 1)

        if (isEmptyLine) {
          linesToRemove.push(line)

          if (removeEmptyLines) {
            const next = code.children[code.children.indexOf(line) + 1]
            if (next && next.type === 'text' && next.value === '\n')
              linesToRemove.push(next)
          }
        }
      })

      for (const line of linesToRemove)
        code.children.splice(code.children.indexOf(line), 1)
    },
  }
}
