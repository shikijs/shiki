import type { Element, ElementContent } from 'hast'

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

export function parseComments(lines: Element[], jsx: boolean): ParsedComments {
  const out: ParsedComments = []

  for (const line of lines) {
    const elements = line.children
    // one step further for JSX as it's inside `{}`
    const start = jsx ? elements.length - 2 : elements.length - 1

    for (let i = Math.max(start, 0); i < elements.length; i++) {
      const token = elements[i]

      if (token.type !== 'element')
        continue

      const isLast = i === elements.length - 1
      const match = matchToken(token, isLast)
      if (!match)
        continue

      if (jsx && !isLast && i !== 0) {
        const left = elements[i - 1]
        const right = elements[i + 1]

        out.push({
          info: match,
          line,
          token,
          isJsxStyle: isValue(left, '{') && isValue(right, '}'),
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
 * @param token the token node (children of line)
 * @param isLast whether the token is located at the end of line
 */
function matchToken(token: Element, isLast: boolean): [prefix: string, content: string, suffix?: string] | undefined {
  const text = token.children[0]
  if (text.type !== 'text')
    return

  for (const [matcher, endOfLine] of matchers) {
    if (endOfLine && !isLast)
      continue

    // no leading and trailing spaces allowed for matchers
    // we extract the spaces
    let trimmed = text.value.trimStart()
    const spaceFront = text.value.length - trimmed.length

    trimmed = trimmed.trimEnd()
    const spaceEnd = text.value.length - trimmed.length - spaceFront

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
