import type { Element, ElementContent } from 'hast'
import type { MatchAlgorithm } from './notation-transformer'

export type ParsedComments = {
  line: Element
  token: Element
  info: [prefix: string, content: string, suffix?: string]
  isJsxStyle: boolean
}[]

/**
 * some comment formats have to be located at the end of line
 * hence we can skip matching them for other tokens
 */
const matchers: [re: RegExp, endOfLine: boolean][] = [
  [/^(<!--)(.+)(-->)$/, false],
  [/^(\/\*)(.+)(\*\/)$/, false],
  [/^(\/\/|["'#]|;{1,2}|%{1,2}|--)(.*)$/, true],
  /**
   * for multi-line comments like this
   */
  [/^(\*)(.+)$/, true],
]

/**
 * @param lines line tokens
 * @param jsx enable JSX parsing
 * @param matchAlgorithm matching algorithm
 */
export function parseComments(
  lines: Element[],
  jsx: boolean,
  matchAlgorithm: MatchAlgorithm,
): ParsedComments {
  const out: ParsedComments = []

  for (const line of lines) {
    const elements = line.children
    let start = elements.length - 1
    if (matchAlgorithm === 'v1')
      start = 0
    else if (jsx)
      // one step further for JSX as comment is inside curly brackets
      start = elements.length - 2

    for (let i = Math.max(start, 0); i < elements.length; i++) {
      const token = elements[i]
      if (token.type !== 'element')
        continue
      const head = token.children.at(0)
      if (head?.type !== 'text')
        continue

      const isLast = i === elements.length - 1
      const match = matchToken(head.value, isLast)
      if (!match)
        continue

      if (jsx && !isLast && i !== 0) {
        out.push({
          info: match,
          line,
          token,
          isJsxStyle: isValue(elements[i - 1], '{') && isValue(elements[i + 1], '}'),
        })
      }
      else {
        out.push({
          info: match,
          line,
          token,
          isJsxStyle: false,
        })
      }
    }
  }

  return out
}

function isValue(element: ElementContent, value: string): boolean {
  if (element.type !== 'element')
    return false
  const text = element.children[0]
  if (text.type !== 'text')
    return false

  return text.value.trim() === value
}

/**
 * @param text text value of comment node
 * @param isLast whether the token is located at the end of line
 */
function matchToken(text: string, isLast: boolean): [prefix: string, content: string, suffix?: string] | undefined {
  // no leading and trailing spaces allowed for matchers
  // we extract the spaces
  let trimmed = text.trimStart()
  const spaceFront = text.length - trimmed.length

  trimmed = trimmed.trimEnd()
  const spaceEnd = text.length - trimmed.length - spaceFront

  for (const [matcher, endOfLine] of matchers) {
    if (endOfLine && !isLast)
      continue

    const result = matcher.exec(trimmed)
    if (!result)
      continue

    return [
      ' '.repeat(spaceFront) + result[1],
      result[2],
      result[3] ? result[3] + ' '.repeat(spaceEnd) : undefined,
    ]
  }
}

/**
 * Remove empty comment prefixes at line end, e.g. `// `
 *
 * For matchAlgorithm v1
 */
export function v1ClearEndCommentPrefix(text: string): string {
  const regex = /(?:\/\/|["'#]|;{1,2}|%{1,2}|--)(.*)$/
  const result = regex.exec(text)

  if (result && result[1].trim().length === 0) {
    return text.slice(0, result.index)
  }

  return text
}
