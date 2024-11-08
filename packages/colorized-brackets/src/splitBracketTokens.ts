import type { ThemedToken } from 'shiki'
import type { TransformerColorizedBracketsOptions } from './types'
import { escapeRegExp, getEmbeddedLang, resolveConfig, shouldIgnoreToken } from './utils'

export default function splitBracketTokens(
  rawToken: ThemedToken,
  config: TransformerColorizedBracketsOptions,
  lang: string,
): ThemedToken[] {
  const embeddedLang = getEmbeddedLang(rawToken)
  const resolvedConfig = resolveConfig(config, embeddedLang ?? lang)

  if (resolvedConfig.bracketPairs.length === 0 || shouldIgnoreToken(rawToken)) {
    return [rawToken]
  }

  const bracketsRegExp = new RegExp(
    resolvedConfig.bracketPairs
      .flatMap(pair => [pair.opener, pair.closer])
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|'),
  )

  const tokens = [rawToken]
  while (true) {
    const token = tokens.pop()
    if (!token)
      break // shouldn't be possible, but it makes TS happy

    const match = token?.content.match(bracketsRegExp)
    if (!match) {
      tokens.push(token)
      break
    }

    // index is always set since we're not using /g regexp flag, but typescript can't infer that
    const matchIndex = match.index ?? 0

    if (matchIndex > 0) {
      tokens.push({
        ...token,
        content: token.content.substring(0, matchIndex),
      })
    }
    tokens.push({
      ...token,
      content: match[0],
      offset: token.offset + matchIndex,
    })
    if (matchIndex + match[0].length < token.content.length) {
      tokens.push({
        ...token,
        content: token.content.substring(matchIndex + match[0].length),
        offset: token.offset + matchIndex + match[0].length,
      })
    }
    else {
      break
    }
  }

  const explanations = rawToken.explanation ?? []
  let currentExplanationStart = 0
  const explanationsWithStartEnd = (explanations ?? []).map(
    (explanation, i) => {
      const start = currentExplanationStart
      let length = explanation.content.length

      // with shiki option mergeWhitespaces (default true), the leading/trailing whitespaces of the token and explanations do not necessarily match
      if (explanations.length === 1) {
        length = rawToken.content.length
      }
      else if (i === 0) {
        length
          = (rawToken.content.match(/^\s*/)?.[0].length ?? 0)
          + explanation.content.trimStart().length
      }
      else if (i === explanations.length - 1) {
        length
          = explanation.content.trimEnd().length
          + (rawToken.content.match(/\s*$/)?.[0].length ?? 0)
      }
      currentExplanationStart += length
      return {
        ...explanation,
        start,
        end: start + length - 1,
      }
    },
  )
  for (const token of tokens) {
    const tokenStart = token.offset - rawToken.offset
    const tokenEnd = tokenStart + token.content.length - 1
    const overlappingExplanations = explanationsWithStartEnd.filter(
      explanation =>
        // token start in explanation range
        (tokenStart >= explanation.start && tokenStart <= explanation.end)
        // token end in explanation range
        || (tokenEnd >= explanation.start && tokenEnd <= explanation.end)
        // explanation start in token range
        || (explanation.start >= tokenStart && explanation.start <= tokenEnd)
        // explanation end in token range
        || (explanation.end >= tokenStart && explanation.end <= tokenEnd),
    )
    token.explanation = overlappingExplanations.map(
      (exp, i) => explanations[i],
    )
  }
  return tokens
}
