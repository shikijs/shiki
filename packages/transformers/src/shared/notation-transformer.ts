import type { ShikiTransformer, ShikiTransformerContext } from '@shikijs/core'
import type { Element, Text } from 'hast'
import type { ParsedComments } from './parse-comments'
import { parseComments, v1ClearEndCommentPrefix } from './parse-comments'

export type MatchAlgorithm = 'v1' | 'v3'

export interface MatchAlgorithmOptions {
  /**
   * Match algorithm to use
   *
   * @see https://shiki.style/packages/transformers#matching-algorithm
   * @default 'v3'
   */
  matchAlgorithm?: MatchAlgorithm
}

export function createCommentNotationTransformer(
  name: string,
  regex: RegExp,
  onMatch: (
    this: ShikiTransformerContext,
    match: string[],
    line: Element,
    commentNode: Element,
    lines: Element[],
    index: number
  ) => boolean,
  matchAlgorithm: MatchAlgorithm | undefined,
): ShikiTransformer {
  if (matchAlgorithm == null) {
    matchAlgorithm = 'v3'
  }

  return {
    name,
    code(code) {
      const lines = code.children.filter(i => i.type === 'element')
      const linesToRemove: (Element | Text)[] = []

      code.data ??= {} as any
      const data = code.data as {
        _shiki_notation?: ParsedComments
      }

      data._shiki_notation ??= parseComments(lines, ['jsx', 'tsx'].includes(this.options.lang), matchAlgorithm)
      const parsed = data._shiki_notation

      for (const comment of parsed) {
        if (comment.info[1].length === 0)
          continue

        let lineIdx = lines.indexOf(comment.line)
        if (comment.isLineCommentOnly && matchAlgorithm !== 'v1')
          lineIdx++

        let replaced = false
        comment.info[1] = comment.info[1].replace(regex, (...match) => {
          if (onMatch.call(this, match, comment.line, comment.token, lines, lineIdx)) {
            replaced = true
            return ''
          }

          return match[0]
        })

        if (!replaced)
          continue

        if (matchAlgorithm === 'v1')
          comment.info[1] = v1ClearEndCommentPrefix(comment.info[1])

        const isEmpty = comment.info[1].trim().length === 0
        // ignore comment node
        if (isEmpty)
          comment.info[1] = ''

        if (isEmpty && comment.isLineCommentOnly) {
          linesToRemove.push(comment.line)
        }
        else if (isEmpty && comment.isJsxStyle) {
          comment.line.children.splice(comment.line.children.indexOf(comment.token) - 1, 3)
        }
        else if (isEmpty) {
          comment.line.children.splice(comment.line.children.indexOf(comment.token), 1)
        }
        else {
          const head = comment.token.children[0]

          if (head.type === 'text') {
            head.value = comment.info.join('')
          }
        }
      }

      for (const line of linesToRemove) {
        const index = code.children.indexOf(line)
        const nextLine = code.children[index + 1]
        let removeLength = 1
        if (nextLine?.type === 'text' && nextLine?.value === '\n')
          removeLength = 2
        code.children.splice(index, removeLength)
      }
    },
  }
}
