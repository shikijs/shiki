import type { ThemedToken, ThemedTokenWithVariants, TokenStyles } from '@shikijs/types'
import { FontStyle } from '@shikijs/vscode-textmate'

/**
 * Split a token into multiple tokens by given offsets.
 *
 * The offsets are relative to the token, and should be sorted.
 */
export function splitToken<
  T extends Pick<ThemedToken, 'content' | 'offset'>,
>(
  token: T,
  offsets: number[],
): T[] {
  let lastOffset = 0
  const tokens: T[] = []

  for (const offset of offsets) {
    if (offset > lastOffset) {
      tokens.push({
        ...token,
        content: token.content.slice(lastOffset, offset),
        offset: token.offset + lastOffset,
      })
    }
    lastOffset = offset
  }

  if (lastOffset < token.content.length) {
    tokens.push({
      ...token,
      content: token.content.slice(lastOffset),
      offset: token.offset + lastOffset,
    })
  }

  return tokens
}

/**
 * Split 2D tokens array by given breakpoints.
 */
export function splitTokens<
  T extends Pick<ThemedToken, 'content' | 'offset'>,
>(
  tokens: T[][],
  breakpoints: number[] | Set<number>,
): T[][] {
  const sorted = Array
    .from(breakpoints instanceof Set ? breakpoints : new Set(breakpoints))
    .sort((a, b) => a - b)

  if (!sorted.length)
    return tokens

  return tokens.map((line) => {
    return line.flatMap((token) => {
      const breakpointsInToken = sorted
        .filter(i => token.offset < i && i < token.offset + token.content.length)
        .map(i => i - token.offset)
        .sort((a, b) => a - b)

      if (!breakpointsInToken.length)
        return token

      return splitToken(token, breakpointsInToken)
    })
  })
}

export function flatTokenVariants(
  merged: ThemedTokenWithVariants,
  variantsOrder: string[],
  cssVariablePrefix: string,
  defaultColor: string | boolean,
): ThemedToken {
  const token: ThemedToken = {
    content: merged.content,
    explanation: merged.explanation,
    offset: merged.offset,
  }

  const styles = variantsOrder.map(t => getTokenStyleObject(merged.variants[t]))

  // Get all style keys, for themes that missing some style, we put `inherit` to override as needed
  const styleKeys = new Set(styles.flatMap(t => Object.keys(t)))
  const mergedStyles: Record<string, string> = {}

  styles.forEach((cur, idx) => {
    for (const key of styleKeys) {
      const value = cur[key] || 'inherit'

      if (idx === 0 && defaultColor) {
        mergedStyles[key] = value
      }
      else {
        const keyName = key === 'color' ? '' : key === 'background-color' ? '-bg' : `-${key}`
        const varKey = cssVariablePrefix + variantsOrder[idx] + (key === 'color' ? '' : keyName)
        mergedStyles[varKey] = value
      }
    }
  })

  token.htmlStyle = mergedStyles
  return token
}

export function getTokenStyleObject(token: TokenStyles): Record<string, string> {
  const styles: Record<string, string> = {}
  if (token.color)
    styles.color = token.color
  if (token.bgColor)
    styles['background-color'] = token.bgColor
  if (token.fontStyle) {
    if (token.fontStyle & FontStyle.Italic)
      styles['font-style'] = 'italic'
    if (token.fontStyle & FontStyle.Bold)
      styles['font-weight'] = 'bold'
    const decorations = []
    if (token.fontStyle & FontStyle.Underline)
      decorations.push('underline')
    if (token.fontStyle & FontStyle.Strikethrough)
      decorations.push('line-through')
    if (decorations.length)
      styles['text-decoration'] = decorations.join(' ')
  }
  return styles
}

export function stringifyTokenStyle(token: string | Record<string, string>): string {
  if (typeof token === 'string')
    return token
  return Object.entries(token).map(([key, value]) => `${key}:${value}`).join(';')
}
