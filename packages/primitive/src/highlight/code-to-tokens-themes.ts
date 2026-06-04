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
  codeToTokensBaseFn: typeof codeToTokensBase = codeToTokensBase,
): ThemedTokenWithVariants[][] {
  const themes = Object
    .entries(options.themes)
    .filter(i => i[1])
    .map(i => ({ color: i[0], theme: i[1]! }))

  const themedTokens = themes.map((t) => {
    const tokens = codeToTokensBaseFn(primitive, code, {
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
  const count = themes.length

  // Pre-allocate the per-theme output 2D arrays once.
  const outThemes: ThemedToken[][][] = Array.from({ length: count }, () => [])
  // Per-iteration scratch arrays. Reused across lines to avoid repeated
  // `Array.from`/`.map` allocations on the multi-theme hot path.
  const lines: ThemedToken[][] = Array.from({ length: count })
  const indexes = new Int32Array(count)
  const current: (ThemedToken | undefined)[] = Array.from({ length: count })

  const lineCount = themes[0].length
  for (let i = 0; i < lineCount; i++) {
    // Fresh per-line output rows; push them into each theme's 2D array.
    const outLines: ThemedToken[][] = Array.from({ length: count }, () => [])
    for (let n = 0; n < count; n++) {
      outThemes[n].push(outLines[n])
      lines[n] = themes[n][i]
      indexes[n] = 0
      current[n] = lines[n][0]
    }

    // Walk every theme's token stream in parallel, slicing at the smallest
    // remaining token-content length.
    while (true) {
      // Track minLength inline instead of `Math.min(...current.map(...))`
      // (which builds an intermediate array and spreads N args per call).
      let minLength = Infinity
      let allPresent = true
      for (let n = 0; n < count; n++) {
        const t = current[n]
        if (!t) {
          allPresent = false
          break
        }
        const l = t.content.length
        if (l < minLength)
          minLength = l
      }
      if (!allPresent)
        break

      for (let n = 0; n < count; n++) {
        const token = current[n]!
        if (token.content.length === minLength) {
          outLines[n].push(token)
          indexes[n] += 1
          current[n] = lines[n][indexes[n]]
        }
        else {
          // Token spans more than minLength: emit a head slice and continue
          // with the tail. Two clones are required because downstream code
          // treats `ThemedToken` as immutable.
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
