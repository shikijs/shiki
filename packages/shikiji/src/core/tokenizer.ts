/* ---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *-------------------------------------------------------- */
'use strict'

import type { IGrammar, IRawTheme } from 'vscode-textmate'
import { INITIAL } from 'vscode-textmate'
import type { CodeToThemedTokensOptions, ShikiContext, ThemedToken, ThemedTokenScopeExplanation } from '../types'
import type { FontStyle } from './stackElementMetadata'
import { StackElementMetadata } from './stackElementMetadata'
import { isPlaintext } from './utils'

export interface TokenizeWithThemeOptions {
  includeExplanation?: boolean
}

export function codeToThemedTokens(
  context: ShikiContext,
  code: string,
  options: CodeToThemedTokensOptions = {},
): ThemedToken[][] {
  const {
    lang = 'text',
    theme: themeName = context.getLoadedThemes()[0],
    includeExplanation = true,
  } = options

  if (isPlaintext(lang)) {
    const lines = code.split(/\r\n|\r|\n/)
    return [...lines.map(line => [{ content: line }])]
  }
  const _grammar = context.getLangGrammar(lang)
  const { theme, colorMap } = context.setTheme(themeName)
  return tokenizeWithTheme(code, _grammar, theme, colorMap, {
    includeExplanation,
  })
}

export function tokenizeWithTheme(
  fileContents: string,
  grammar: IGrammar,
  theme: IRawTheme,
  colorMap: string[],
  options: { includeExplanation?: boolean },
): ThemedToken[][] {
  const lines = fileContents.split(/\r\n|\r|\n/)

  let ruleStack = INITIAL
  let actual: ThemedToken[] = []
  const final: ThemedToken[][] = []

  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i]
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
      const foregroundColor = colorMap[foreground]
      const fontStyle: FontStyle = StackElementMetadata.getFontStyle(metadata)

      const token: ThemedToken = {
        content: line.substring(startIndex, nextStartIndex),
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

function explainThemeScopes(theme: IRawTheme, scopes: string[]): ThemedTokenScopeExplanation[] {
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

function explainThemeScope(theme: IRawTheme, scope: string, parentScopes: string[]): any[] {
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
