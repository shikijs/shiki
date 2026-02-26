import type {
  CodeToTokensWithThemesOptions,
  ShikiPrimitive,
  ThemedToken,
  ThemedTokenWithVariants,
} from '@shikijs/types'
import { getLastGrammarStateFromMap, GrammarState, setLastGrammarStateToMap } from '../textmate/grammar-state'
import { codeToTokensBase } from './code-to-tokens-base'

/**
 * Get tokens with multiple themes
 */
export function codeToTokensWithThemes(
  primitive: ShikiPrimitive,
  code: string,
  options: CodeToTokensWithThemesOptions,
): ThemedTokenWithVariants[][] {
  const themes = Object
    .entries(options.themes)
    .filter(i => i[1])
    .map(i => ({ color: i[0], theme: i[1]! }))

  const themedTokens = themes.map((t) => {
    const tokens = codeToTokensBase(primitive, code, {
      ...options,
      theme: t.theme,
    })
    const state = getLastGrammarStateFromMap(tokens)
    const theme = typeof t.theme === 'string'
      ? t.theme
      : t.theme.name
    return {
      tokens,
      state,
      theme,
    }
  })

  const tokens = alignThemesTokenization(
    ...themedTokens.map(i => i.tokens),
  )

  const mergedTokens: ThemedTokenWithVariants[][] = tokens[0]
    .map((line, lineIdx) => line
      .map((_token, tokenIdx) => {
        const mergedToken: ThemedTokenWithVariants = {
          content: _token.content,
          variants: {},
          offset: _token.offset,
        }

        if ('includeExplanation' in options && options.includeExplanation) {
          mergedToken.explanation = _token.explanation
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

  const mergedGrammarState = themedTokens[0].state
    ? new GrammarState(
        Object.fromEntries(themedTokens.map(s => [s.theme, s.state?.getInternalStack(s.theme)])),
        themedTokens[0].state.lang,
      )
    : undefined
  if (mergedGrammarState)
    setLastGrammarStateToMap(mergedTokens, mergedGrammarState)

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
export function alignThemesTokenization(...themes: ThemedToken[][][]): ThemedToken[][][] {
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
