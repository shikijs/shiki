import type { Element, Text } from 'hast'
import type { ShikiTransformer, ShikiTransformerContext } from 'shiki'

/**
 * Regex that matches code comments
 */
const regex = /((?:\/\/|\/\*|<!--|[#"']|--|%%|;{1,2}|%{1,2})\s*)(\S.*?)(-->|\*\/|$)/

/**
 * Create a transformer to process comment notations
 *
 * @param name transformer name
 * @param onMatch function to be called when found a comment in code, return the replaced text.
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
): ShikiTransformer {
  return {
    name,
    code(code) {
      const lines = code.children.filter(i => i.type === 'element') as Element[]
      const linesToRemove: (Element | Text)[] = []

      lines.forEach((line, lineIdx) => {
        // comment should be at the end of line (last token)
        const last = line.children.findLast(i => i.type === 'element') as Element | undefined

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

        if (isEmptyLine) {
          linesToRemove.push(line)
        }
        else {
          line.children.splice(line.children.indexOf(last), 1)
        }
      })

      for (const line of linesToRemove)
        code.children.splice(code.children.indexOf(line), 1)
    },
  }
}

export { createCommentNotationTransformer } from './utils-legacy'
