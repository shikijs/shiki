import type {
  CodeToTokensWithThemesOptions,
  ShikiInternal,
  ThemedToken,
  ThemedTokenWithVariants,
} from './types'
import { codeToThemedTokens } from './code-to-tokens'

/**
 * Get tokens with multiple themes
 */
export function codeToTokensWithThemes(
  internal: ShikiInternal,
  code: string,
  options: CodeToTokensWithThemesOptions,
): ThemedTokenWithVariants[][] {
  const themes = Object.entries(options.themes)
    .filter(i => i[1])
    .map(i => ({ color: i[0], theme: i[1]! }))

  const tokens = syncThemesTokenization(
    ...themes.map(t => codeToThemedTokens(internal, code, {
      ...options,
      theme: t.theme,
      includeExplanation: false,
    })),
  )

  const mergedTokens: ThemedTokenWithVariants[][] = tokens[0]
    .map((line, lineIdx) => line
      .map((_token, tokenIdx) => {
        const mergedToken: ThemedTokenWithVariants = {
          content: _token.content,
          variants: {},
          offset: _token.offset,
        }

        tokens.forEach((t, themeIdx) => {
          const {
            content: _,
            explanation: __,
            offset: ___,
            ...styles
          } = t[lineIdx][tokenIdx]

          mergedToken.variants[themes[themeIdx].color] = styles
        })

        return mergedToken
      }),
    )

  return mergedTokens
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
            offset: token.offset + minLength,
          }
        }
      }
    }
  }

  return outThemes
}
