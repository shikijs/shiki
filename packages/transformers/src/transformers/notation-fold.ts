import type { ShikiTransformer } from '@shikijs/types'
import type { Element, Text } from 'hast'
import { parseComments } from '../shared/parse-comments'

export interface TransformerNotationFoldOptions {
  /**
   * Class for the start line of a fold
   */
  classFoldStart?: string
  /**
   * Class for the end line of a fold
   */
  classFoldEnd?: string
  /**
   * Class for the content lines of a fold (excluding start and end)
   */
  classFoldContent?: string
}

export function transformerNotationFold(
  options: TransformerNotationFoldOptions = {},
): ShikiTransformer {
  const {
    classFoldStart = 'fold-start',
    classFoldEnd = 'fold-end',
    classFoldContent = 'fold-content',
  } = options

  return {
    name: '@shikijs/transformers:notation-fold',
    code(code) {
      const lines = code.children.filter(i => i.type === 'element') as Element[]
      const linesToRemove: (Element | Text)[] = []

      code.data ??= {} as any
      const data = code.data as {
        _shiki_notation?: ReturnType<typeof parseComments>
      }

      data._shiki_notation ??= parseComments(lines, ['jsx', 'tsx'].includes(this.options.lang), 'v3')
      const parsed = data._shiki_notation

      const stack: { line: Element, type: 'shiki' | 'region' }[] = []

      for (const comment of parsed) {
        if (comment.info[1].length === 0)
          continue

        let text = comment.info[1]
        let isStart = false
        let isEnd = false
        let isRegion = false

        // Check shiki syntax
        if (text.match(/\[!code fold:start(:.*)?\]/i)) {
          isStart = true
          // Remove marker
          text = text.replace(/\[!code fold:start(:.*)?\]/i, '').trim()
          comment.info[1] = text
        }
        else if (text.match(/\[!code fold:end\]/i)) {
          isEnd = true
          // Remove marker
          text = text.replace(/\[!code fold:end\]/i, '').trim()
          comment.info[1] = text
        }
        // Check region syntax
        else if (text.match(/^\s*#region\b/)) {
          isStart = true
          isRegion = true
        }
        else if (text.match(/^\s*#endregion\b/)) {
          isEnd = true
          isRegion = true
        }

        if (!isStart && !isEnd)
          continue

        // Update the AST if we modified the text
        if (isStart || isEnd) {
          const head = comment.token.children[0]
          if (head.type === 'text') {
            head.value = text
          }
        }

        const line = comment.line
        // Find line index in lines array for logical navigation
        const lineIdx = lines.indexOf(line)

        // If text is empty (and it wasn't a region), remove the line
        if (text.length === 0 && !isRegion) {
          linesToRemove.push(line)
        }

        if (isStart) {
          if (isRegion) {
            stack.push({ line, type: 'region' })
            this.addClassToHast(line, classFoldStart)
          }
          else {
            // Shiki syntax
            // Target next line
            const nextLineIdx = lineIdx + 1
            if (nextLineIdx < lines.length) {
              const nextLine = lines[nextLineIdx]
              stack.push({ line: nextLine, type: 'shiki' })
              this.addClassToHast(nextLine, classFoldStart)
            }
          }
        }
        else if (isEnd) {
          const start = stack.pop()
          if (start) {
            let endLine: Element | undefined

            if (isRegion) {
              endLine = line
              this.addClassToHast(endLine, classFoldEnd)
            }
            else {
              // Shiki syntax
              // Target PREVIOUS line
              const prevLineIdx = lineIdx - 1
              if (prevLineIdx >= 0) {
                endLine = lines[prevLineIdx]
                this.addClassToHast(endLine, classFoldEnd)
              }
            }

            // Mark content lines
            if (start && endLine) {
              const startIdx = lines.indexOf(start.line)
              const endIdx = lines.indexOf(endLine)

              if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
                for (let i = startIdx + 1; i < endIdx; i++) {
                  this.addClassToHast(lines[i], classFoldContent)
                }
              }
            }
          }
        }
      }

      // Remove lines
      for (const line of linesToRemove) {
        const index = code.children.indexOf(line)
        if (index !== -1) {
          const nextLine = code.children[index + 1]
          let removeLength = 1
          if (nextLine?.type === 'text' && nextLine?.value === '\n')
            removeLength = 2
          code.children.splice(index, removeLength)
        }
      }
    },
  }
}
