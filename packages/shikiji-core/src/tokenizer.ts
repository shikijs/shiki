/* ---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *-------------------------------------------------------- */
import type { IGrammar } from './textmate'
import { INITIAL } from './textmate'
import type { CodeToThemedTokensOptions, FontStyle, ShikiInternal, ThemeRegistrationResolved, ThemedToken, ThemedTokenScopeExplanation, TokenizeWithThemeOptions } from './types'
import { StackElementMetadata } from './stack-element-metadata'
import { applyColorReplacements, isPlaintext, splitLines } from './utils'
import { tokenizeAnsiWithTheme } from './tokenizer-ansi'

export function codeToThemedTokens(
  internal: ShikiInternal,
  code: string,
  options: CodeToThemedTokensOptions = {},
): ThemedToken[][] {
  const {
    lang = 'text',
    theme: themeName = internal.getLoadedThemes()[0],
  } = options

  if (isPlaintext(lang))
    return splitLines(code).map(line => [{ content: line[0], offset: line[1] }])

  const { theme, colorMap } = internal.setTheme(themeName)

  if (lang === 'ansi')
    return tokenizeAnsiWithTheme(theme, code, options)

  const _grammar = internal.getLangGrammar(lang)
  return tokenizeWithTheme(code, _grammar, theme, colorMap, options)
}

export function tokenizeWithTheme(
  code: string,
  grammar: IGrammar,
  theme: ThemeRegistrationResolved,
  colorMap: string[],
  options: TokenizeWithThemeOptions,
): ThemedToken[][] {
  const colorReplacements = {
    ...theme.colorReplacements,
    ...options?.colorReplacements,
  }

  const lines = splitLines(code)

  let ruleStack = INITIAL
  let actual: ThemedToken[] = []
  const final: ThemedToken[][] = []

  for (let i = 0, len = lines.length; i < len; i++) {
    const [line, lineOffset] = lines[i]
    if (line === '') {
      actual = []
      final.push([])
      continue
    }

    let resultWithScopes
    let tokensWithScopes
    let tokensWithScopesIndex

    if (options.includeExplanation) {
      resultWithScopes = grammar.tokenizeLine(line, ruleStack)
      tokensWithScopes = resultWithScopes.tokens
      tokensWithScopesIndex = 0
    }

    const result = grammar.tokenizeLine2(line, ruleStack)

    const tokensLength = result.tokens.length / 2
    for (let j = 0; j < tokensLength; j++) {
      const startIndex = result.tokens[2 * j]
      const nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length
      if (startIndex === nextStartIndex)
        continue

      const metadata = result.tokens[2 * j + 1]
      const foreground = StackElementMetadata.getForeground(metadata)
      const foregroundColor = applyColorReplacements(colorMap[foreground], colorReplacements)
      const fontStyle: FontStyle = StackElementMetadata.getFontStyle(metadata)

      const token: ThemedToken = {
        content: line.substring(startIndex, nextStartIndex),
        offset: lineOffset + startIndex,
        color: foregroundColor,
        fontStyle,
      }

      if (options.includeExplanation) {
        token.explanation = []
        let offset = 0
        while (startIndex + offset < nextStartIndex) {
          const tokenWithScopes = tokensWithScopes![tokensWithScopesIndex!]

          const tokenWithScopesText = line.substring(
            tokenWithScopes.startIndex,
            tokenWithScopes.endIndex,
          )
          offset += tokenWithScopesText.length
          token.explanation.push({
            content: tokenWithScopesText,
            scopes: explainThemeScopes(theme, tokenWithScopes.scopes),
          })

          tokensWithScopesIndex! += 1
        }
      }

      actual.push(token)
    }
    final.push(actual)
    actual = []
    ruleStack = result.ruleStack
  }

  return final
}

function explainThemeScopes(
  theme: ThemeRegistrationResolved,
  scopes: string[],
): ThemedTokenScopeExplanation[] {
  const result: ThemedTokenScopeExplanation[] = []
  for (let i = 0, len = scopes.length; i < len; i++) {
    const parentScopes = scopes.slice(0, i)
    const scope = scopes[i]
    result[i] = {
      scopeName: scope,
      themeMatches: explainThemeScope(theme, scope, parentScopes),
    }
  }
  return result
}

function matchesOne(selector: string, scope: string): boolean {
  const selectorPrefix = `${selector}.`
  if (selector === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix)
    return true

  return false
}

function matches(
  selector: string,
  selectorParentScopes: string[],
  scope: string,
  parentScopes: string[],
): boolean {
  if (!matchesOne(selector, scope))
    return false

  let selectorParentIndex = selectorParentScopes.length - 1
  let parentIndex = parentScopes.length - 1
  while (selectorParentIndex >= 0 && parentIndex >= 0) {
    if (matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex]))
      selectorParentIndex -= 1
    parentIndex -= 1
  }

  if (selectorParentIndex === -1)
    return true

  return false
}

function explainThemeScope(
  theme: ThemeRegistrationResolved,
  scope: string,
  parentScopes: string[],
): any[] {
  const result: any[] = []
  let resultLen = 0
  for (let i = 0, len = theme.settings.length; i < len; i++) {
    const setting = theme.settings[i]
    let selectors: string[]
    if (typeof setting.scope === 'string')
      selectors = setting.scope.split(/,/).map(scope => scope.trim())
    else if (Array.isArray(setting.scope))
      selectors = setting.scope
    else
      continue

    for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
      const rawSelector = selectors[j]
      const rawSelectorPieces = rawSelector.split(/ /)

      const selector = rawSelectorPieces[rawSelectorPieces.length - 1]
      const selectorParentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1)

      if (matches(selector, selectorParentScopes, scope, parentScopes)) {
        // match!
        result[resultLen++] = setting
        // break the loop
        j = lenJ
      }
    }
  }
  return result
}
