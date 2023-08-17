import type { CodeToTokensWithThemesOptions, ShikiContext, ThemedToken } from '../types'
import { codeToThemedTokens } from './tokenizer'

/**
 * Get tokens with multiple themes, with synced
 */
export function codeToTokensWithThemes(
  context: ShikiContext,
  code: string,
  options: CodeToTokensWithThemesOptions,
) {
  const themes = Object.entries(options.themes)
    .filter(i => i[1]) as [string, string][]

  const tokens = syncThemesTokenization(
    ...themes.map(t => codeToThemedTokens(context, code, {
      ...options,
      theme: t[1],
      includeExplanation: false,
    })),
  )

  return themes.map(([color, theme], idx) => [
    color,
    theme,
    tokens[idx],
  ] as [string, string, ThemedToken[][]])
}

/**
 * Break tokens from multiple themes into same tokenization.
 *
 * For example, given two themes that tokenize `console.log("hello")` as:
 *
 * - `console . log (" hello ")` (6 tokens)
 * - `console .log ( "hello" )` (5 tokens)
 *
 * This function will return:
 *
 * - `console . log ( " hello " )` (8 tokens)
 * - `console . log ( " hello " )` (8 tokens)
 */
export function syncThemesTokenization(...themes: ThemedToken[][][]) {
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
