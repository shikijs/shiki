import type { Element } from 'hast'
import { FontStyle } from './types'
import type { MaybeArray, PlainTextLanguage, Position, SpecialLanguage, SpecialTheme, ThemeInput, ThemeRegistrationAny, ThemedToken, TokenStyles, TokenizeWithThemeOptions } from './types'

export function toArray<T>(x: MaybeArray<T>): T[] {
  return Array.isArray(x) ? x : [x]
}

/**
 * Split a string into lines, each line preserves the line ending.
 */
export function splitLines(code: string, preserveEnding = false): [string, number][] {
  const parts = code.split(/(\r?\n)/g)
  let index = 0
  const lines: [string, number][] = []
  for (let i = 0; i < parts.length; i += 2) {
    const line = preserveEnding
      ? parts[i] + (parts[i + 1] || '')
      : parts[i]
    lines.push([line, index])
    index += parts[i].length
    index += parts[i + 1]?.length || 0
  }
  return lines
}

/**
 * Check if the language is plaintext that is ignored by Shiki.
 *
 * Hard-coded plain text languages: `plaintext`, `txt`, `text`, `plain`.
 */
export function isPlainLang(lang: string | null | undefined): lang is PlainTextLanguage {
  return !lang || ['plaintext', 'txt', 'text', 'plain'].includes(lang)
}

/**
 * Check if the language is specially handled or bypassed by Shiki.
 *
 * Hard-coded languages: `ansi` and plaintexts like `plaintext`, `txt`, `text`, `plain`.
 */
export function isSpecialLang(lang: any): lang is SpecialLanguage {
  return lang === 'ansi' || isPlainLang(lang)
}

/**
 * Check if the theme is specially handled or bypassed by Shiki.
 *
 * Hard-coded themes: `none`.
 */
export function isNoneTheme(theme: string | ThemeInput | null | undefined): theme is 'none' {
  return theme === 'none'
}

/**
 * Check if the theme is specially handled or bypassed by Shiki.
 *
 * Hard-coded themes: `none`.
 */
export function isSpecialTheme(theme: string | ThemeInput | null | undefined): theme is SpecialTheme {
  return isNoneTheme(theme)
}

/**
 * Utility to append class to a hast node
 *
 * If the `property.class` is a string, it will be splitted by space and converted to an array.
 */
export function addClassToHast(node: Element, className: string | string[]) {
  if (!className)
    return node
  node.properties ||= {}
  node.properties.class ||= []
  if (typeof node.properties.class === 'string')
    node.properties.class = node.properties.class.split(/\s+/g)
  if (!Array.isArray(node.properties.class))
    node.properties.class = []

  const targets = Array.isArray(className) ? className : className.split(/\s+/g)
  for (const c of targets) {
    if (c && !node.properties.class.includes(c))
      node.properties.class.push(c)
  }
  return node
}

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
>(tokens: T[][], breakpoints: number[] | Set<number>) {
  const sorted = Array.from(breakpoints instanceof Set ? breakpoints : new Set(breakpoints))
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

export function resolveColorReplacements(
  theme: ThemeRegistrationAny | string,
  options?: TokenizeWithThemeOptions,
) {
  const replacements = typeof theme === 'string' ? {} : { ...theme.colorReplacements }
  const themeName = typeof theme === 'string' ? theme : theme.name
  for (const [key, value] of Object.entries(options?.colorReplacements || {})) {
    if (typeof value === 'string')
      replacements[key] = value
    else if (key === themeName)
      Object.assign(replacements, value)
  }
  return replacements
}

export function applyColorReplacements(color: string, replacements?: Record<string, string>): string
export function applyColorReplacements(color?: string | undefined, replacements?: Record<string, string>): string | undefined
export function applyColorReplacements(color?: string, replacements?: Record<string, string>): string | undefined {
  if (!color)
    return color
  return replacements?.[color?.toLowerCase()] || color
}

export function getTokenStyleObject(token: TokenStyles) {
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
    if (token.fontStyle & FontStyle.Underline)
      styles['text-decoration'] = 'underline'
  }
  return styles
}

export function stringifyTokenStyle(token: Record<string, string>) {
  return Object.entries(token).map(([key, value]) => `${key}:${value}`).join(';')
}

/**
 * Creates a converter between index and position in a code block.
 *
 * Overflow/underflow are unchecked.
 */
export function createPositionConverter(code: string) {
  const lines = splitLines(code, true).map(([line]) => line)

  function indexToPos(index: number): Position {
    if (index === code.length) {
      return {
        line: lines.length - 1,
        character: lines[lines.length - 1].length,
      }
    }

    let character = index
    let line = 0
    for (const lineText of lines) {
      if (character < lineText.length)
        break
      character -= lineText.length
      line++
    }
    return { line, character }
  }

  function posToIndex(line: number, character: number) {
    let index = 0
    for (let i = 0; i < line; i++)
      index += lines[i].length

    index += character
    return index
  }

  return {
    lines,
    indexToPos,
    posToIndex,
  }
}
