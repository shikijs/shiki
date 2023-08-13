import type { HtmlRendererOptions, ThemedToken } from '../types'
import { renderToHtml } from './renderer-html'

/**
 * Break tokens from multiple themes into same length.
 *
 * For example, given two themes that tokenize `console.log("hello")` as:
 *
 * - `console . log (" hello ")` (6 tokens)
 * - `console .log ( "hello" )` (5 tokens)
 *
 * This function break both themes into same tokenization, so later the can be rendered in pairs.
 *
 * - `console . log ( " hello " )` (8 tokens)
 * - `console . log ( " hello " )` (8 tokens)
 */
export function _syncThemedTokens(...themes: ThemedToken[][][]) {
  const outThemes = themes.map<ThemedToken[][]>(() => [])
  const count = themes.length

  for (let i = 0; i < themes[0].length; i++) {
    const lines = themes.map(t => t[i])

    const outLines = outThemes.map<ThemedToken[]>(() => [])
    outThemes.forEach((t, i) => t.push(outLines[i]))

    const indexes = lines.map(() => 0)
    const current = lines.map(l => l[0])

    while (current.every(t => t)) {
      const minLength = Math.min(...current.map(t => t.content.length))

      for (let n = 0; n < count; n++) {
        const token = current[n]
        if (token.content.length === minLength) {
          outLines[n].push(token)
          indexes[n] += 1
          current[n] = lines[n][indexes[n]]
        }
        else {
          outLines[n].push({
            ...token,
            content: token.content.slice(0, minLength),
          })
          current[n] = {
            ...token,
            content: token.content.slice(minLength),
          }
        }
      }
    }
  }

  return outThemes
}

export function renderToHtmlDualThemes(
  tokens1: ThemedToken[][],
  tokens2: ThemedToken[][],
  cssName = '--shiki-dark',
  options: HtmlRendererOptions = {},
) {
  const [synced1, synced2] = _syncThemedTokens(tokens1, tokens2)

  const merged: ThemedToken[][] = []
  for (let i = 0; i < synced1.length; i++) {
    const line1 = synced1[i]
    const line2 = synced2[i]
    const lineout: any[] = []
    merged.push(lineout)
    for (let j = 0; j < line1.length; j++) {
      const token1 = line1[j]
      const token2 = line2[j]
      lineout.push({
        ...token1,
        color: `${token1.color || 'inherit'};${cssName}: ${token2.color || 'inherit'}`,
      })
    }
  }

  return renderToHtml(merged, options)
}
