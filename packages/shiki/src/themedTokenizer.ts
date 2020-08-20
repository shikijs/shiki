/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict'

import { IGrammar, StackElement, IRawTheme, IRawThemeSetting } from 'vscode-textmate'
import { StackElementMetadata } from './stackElementMetadata'

export interface IThemedTokenScopeExplanation {
  scopeName: string
  themeMatches: IRawThemeSetting[]
}

export interface IThemedTokenExplanation {
  content: string
  scopes: IThemedTokenScopeExplanation[]
}

/**
 * A single token with color, and optionally with explanation.
 *
 * For example:
 *
 * {
 *   "content": "shiki",
 *   "color": "#D8DEE9",
 *   "explanation": [
 *     {
 *       "content": "shiki",
 *       "scopes": [
 *         {
 *           "scopeName": "source.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.objectliteral.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.object.member.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.array.literal.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "variable.other.object.js",
 *           "themeMatches": [
 *             {
 *               "name": "Variable",
 *               "scope": "variable.other",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             },
 *             {
 *               "name": "[JavaScript] Variable Other Object",
 *               "scope": "source.js variable.other.object",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 */
export interface IThemedToken {
  /**
   * The content of the token
   */
  content: string
  /**
   * 6 or 8 digit hex code representation of the token's color
   */
  color?: string
  /**
   * Explanation of
   *
   * - token text's matching scopes
   * - reason that token text is given a color (one matching scope matches a rule (scope -> color) in the theme)
   */
  explanation?: IThemedTokenExplanation[]
}

export function tokenizeWithTheme(
  theme: IRawTheme,
  colorMap: string[],
  fileContents: string,
  grammar: IGrammar,
  options: { includeExplanation?: boolean }
): IThemedToken[][] {
  let lines = fileContents.split(/\r\n|\r|\n/)

  let ruleStack: StackElement = null
  let actual: IThemedToken[] = []
  let final: IThemedToken[][] = []

  for (let i = 0, len = lines.length; i < len; i++) {
    let line = lines[i]
    if (line === '') {
      actual = []
      final.push([])
      continue
    }

    let resultWithScopes = grammar.tokenizeLine(line, ruleStack)
    let tokensWithScopes = resultWithScopes.tokens

    let result = grammar.tokenizeLine2(line, ruleStack)

    let tokensLength = result.tokens.length / 2
    let tokensWithScopesIndex = 0
    for (let j = 0; j < tokensLength; j++) {
      let startIndex = result.tokens[2 * j]
      let nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length
      if (startIndex === nextStartIndex) {
        continue
      }
      let metadata = result.tokens[2 * j + 1]
      let foreground = StackElementMetadata.getForeground(metadata)
      let foregroundColor = colorMap[foreground]

      let explanation: IThemedTokenExplanation[] = []
      if (options.includeExplanation) {
        let offset = 0
        while (startIndex + offset < nextStartIndex) {
          let tokenWithScopes = tokensWithScopes[tokensWithScopesIndex]

          let tokenWithScopesText = line.substring(
            tokenWithScopes.startIndex,
            tokenWithScopes.endIndex
          )
          offset += tokenWithScopesText.length
          explanation.push({
            content: tokenWithScopesText,
            scopes: explainThemeScopes(theme, tokenWithScopes.scopes)
          })

          tokensWithScopesIndex++
        }
      }

      actual.push({
        content: line.substring(startIndex, nextStartIndex),
        color: foregroundColor,
        explanation: explanation
      })
    }
    final.push(actual)
    actual = []
    ruleStack = result.ruleStack
  }

  return final
}

function explainThemeScopes(theme: IRawTheme, scopes: string[]): IThemedTokenScopeExplanation[] {
  let result: IThemedTokenScopeExplanation[] = []
  for (let i = 0, len = scopes.length; i < len; i++) {
    let parentScopes = scopes.slice(0, i)
    let scope = scopes[i]
    result[i] = {
      scopeName: scope,
      themeMatches: explainThemeScope(theme, scope, parentScopes)
    }
  }
  return result
}

function matchesOne(selector: string, scope: string): boolean {
  let selectorPrefix = selector + '.'
  if (selector === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix) {
    return true
  }
  return false
}

function matches(
  selector: string,
  selectorParentScopes: string[],
  scope: string,
  parentScopes: string[]
): boolean {
  if (!matchesOne(selector, scope)) {
    return false
  }

  let selectorParentIndex = selectorParentScopes.length - 1
  let parentIndex = parentScopes.length - 1
  while (selectorParentIndex >= 0 && parentIndex >= 0) {
    if (matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex])) {
      selectorParentIndex--
    }
    parentIndex--
  }

  if (selectorParentIndex === -1) {
    return true
  }
  return false
}

function explainThemeScope(
  theme: IRawTheme,
  scope: string,
  parentScopes: string[]
): IRawThemeSetting[] {
  let result: IRawThemeSetting[] = [],
    resultLen = 0
  for (let i = 0, len = theme.settings.length; i < len; i++) {
    let setting = theme.settings[i]
    let selectors: string[]
    if (typeof setting.scope === 'string') {
      selectors = setting.scope.split(/,/).map(scope => scope.trim())
    } else if (Array.isArray(setting.scope)) {
      selectors = setting.scope
    } else {
      continue
    }
    for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
      let rawSelector = selectors[j]
      let rawSelectorPieces = rawSelector.split(/ /)

      let selector = rawSelectorPieces[rawSelectorPieces.length - 1]
      let selectorParentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1)

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
