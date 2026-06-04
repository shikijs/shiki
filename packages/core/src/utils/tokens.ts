import type { CodeOptionsMultipleThemes, ThemedToken, ThemedTokenWithVariants, TokenStyles } from '@shikijs/types'
import { ShikiError } from '@shikijs/types'
import { FontStyle } from '@shikijs/vscode-textmate'
import { COLOR_KEYS, DEFAULT_COLOR_LIGHT_DARK } from './constants'

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
 *
 * Two-pointer pass over the globally-sorted breakpoint list — tokens are
 * already ordered by offset (per line) so we advance a cursor instead of
 * doing an `O(breakpoints)` `.filter` per token.
 */
export function splitTokens<
  T extends Pick<ThemedToken, 'content' | 'offset'>,
>(
  tokens: T[][],
  breakpoints: number[] | Set<number>,
): T[][] {
  const sorted = [...(breakpoints instanceof Set ? breakpoints : new Set(breakpoints))].sort((a, b) => a - b)

  if (!sorted.length)
    return tokens

  // Per-line cursor — breakpoints are globally sorted and lines emit tokens
  // in offset order, but the cursor still has to reset per line because
  // line tokens restart from a smaller (next-line) offset.
  return tokens.map((line) => {
    let bpIdx = 0
    // Skip breakpoints before the line's first token.
    if (line.length) {
      const lineStart = line[0].offset
      while (bpIdx < sorted.length && sorted[bpIdx] <= lineStart)
        bpIdx += 1
    }

    const out: T[] = []
    for (const token of line) {
      const tokenStart = token.offset
      const tokenEnd = tokenStart + token.content.length

      // Advance past breakpoints entirely behind this token (e.g. from
      // empty-whitespace tokens that don't appear in our token stream).
      while (bpIdx < sorted.length && sorted[bpIdx] <= tokenStart)
        bpIdx += 1

      // Collect breakpoints that land strictly inside this token. They're
      // already sorted thanks to `sorted` being sorted, so no inner sort.
      let collected: number[] | undefined
      while (bpIdx < sorted.length && sorted[bpIdx] < tokenEnd) {
        ;(collected ??= []).push(sorted[bpIdx] - tokenStart)
        bpIdx += 1
      }

      if (!collected) {
        out.push(token)
      }
      else {
        // splitToken pushes each slice; spread into `out`.
        const sliced = splitToken(token, collected)
        for (const t of sliced)
          out.push(t)
      }
    }
    return out
  })
}

// Cache of (cssVariablePrefix → variantIdx → styleKey → varName) so per-token
// loops on the multi-theme hot path don't rebuild the same strings over and
// over. The outer key is the prefix because callers may use different
// prefixes; the inner Map's key is `${idx}\0${styleKey}` (\0 isn't valid in
// either input) so we don't have to nest a third map.
const varKeyCache = new Map<string, Map<string, string>>()
function getVarKey(
  cssVariablePrefix: string,
  variantsOrder: string[],
  idx: number,
  key: string,
): string {
  let bucket = varKeyCache.get(cssVariablePrefix)
  if (!bucket) {
    bucket = new Map()
    varKeyCache.set(cssVariablePrefix, bucket)
  }
  // Cache key is keyed by (variant name, style key) — the `idx` itself is
  // just an offset into `variantsOrder`; caching by variant *name* keeps the
  // cache stable across calls with different variant orderings.
  const variantName = variantsOrder[idx]
  const cacheKey = `${variantName}\0${key}`
  let cached = bucket.get(cacheKey)
  if (cached !== undefined)
    return cached

  const keyName = key === 'color' ? '' : key === 'background-color' ? '-bg' : `-${key}`
  cached = cssVariablePrefix + variantName + (key === 'color' ? '' : keyName)
  bucket.set(cacheKey, cached)
  return cached
}

export function flatTokenVariants(
  merged: ThemedTokenWithVariants,
  variantsOrder: string[],
  cssVariablePrefix: string,
  defaultColor: CodeOptionsMultipleThemes['defaultColor'],
  colorsRendering: CodeOptionsMultipleThemes['colorsRendering'] = 'css-vars',
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

  // Resolve light/dark variant indices once when needed instead of per-key.
  let lightIndex = -1
  let darkIndex = -1
  if (defaultColor === DEFAULT_COLOR_LIGHT_DARK && styles.length > 1) {
    lightIndex = variantsOrder.indexOf('light')
    darkIndex = variantsOrder.indexOf('dark')
  }

  styles.forEach((cur, idx) => {
    for (const key of styleKeys) {
      const value = cur[key] || 'inherit'

      if (idx === 0 && defaultColor && COLOR_KEYS.includes(key)) {
        // light-dark()
        if (defaultColor === DEFAULT_COLOR_LIGHT_DARK && styles.length > 1) {
          if (lightIndex === -1 || darkIndex === -1)
            throw new ShikiError('When using `defaultColor: "light-dark()"`, you must provide both `light` and `dark` themes')
          const lightValue = styles[lightIndex][key] || 'inherit'
          const darkValue = styles[darkIndex][key] || 'inherit'
          mergedStyles[key] = `light-dark(${lightValue}, ${darkValue})`
          if (colorsRendering === 'css-vars')
            mergedStyles[getVarKey(cssVariablePrefix, variantsOrder, idx, key)] = value
        }
        else {
          mergedStyles[key] = value
        }
      }
      else {
        if (colorsRendering === 'css-vars')
          mergedStyles[getVarKey(cssVariablePrefix, variantsOrder, idx, key)] = value
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
  // Manual loop avoids the `Object.entries` + intermediate array + `.map` +
  // `.join` triple-allocation. Called per token by the HAST builder.
  let out = ''
  let first = true
  for (const key in token) {
    const value = token[key]
    if (first) {
      out = `${key}:${value}`
      first = false
    }
    else {
      out += `;${key}:${value}`
    }
  }
  return out
}
