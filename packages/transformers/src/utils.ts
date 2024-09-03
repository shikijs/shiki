import type { Element, Text } from 'hast'
import type { ShikiTransformer, ShikiTransformerContext } from 'shiki'

/**
 * Regex that matches code comments
 */
const regex = /(\/\/|\/\*|<!--|[#"'%;]|--|%%|;;)(.+?)(-->|\*\/|$)/

/**
 * Create a transformer to process comment notations
 *
 * @param name transformer name
 * @param onMatch function to be called when found a comment in code, return the replaced text.
 * @param removeEmptyLines remove empty lines below if matched
 */
export function createCommentNotationTransformerExperimental(
  name: string,
  onMatch: (
    this: ShikiTransformerContext,
    commentText: string,
    line: Element,
    commentNode: Element,
    lines: Element[],
    index: number,
  ) => string,
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

        if (!last || last.children.length === 0)
          return
        const text = last.children[0]
        if (text.type !== 'text')
          return

        let deleteComment = false

        const isEmptyLine = line.children.length === 1
        text.value = text.value.replace(regex, (_, prefix, text, end) => {
          // no other tokens except the comment
          const replaced = onMatch.call(this, text, line, last, lines,
            // take the next line if the current line will be removed
            isEmptyLine ? lineIdx + 1 : lineIdx)

          if (replaced.trim().length === 0)
            deleteComment = true

          return prefix + replaced + end
        })

        if (!deleteComment)
          return

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

export { createCommentNotationTransformer } from './utils-legacy'
