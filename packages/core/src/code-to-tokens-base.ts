/* ---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *-------------------------------------------------------- */
import type { IGrammar, IRawThemeSetting } from './textmate'
import { INITIAL } from './textmate'
import type { CodeToTokensBaseOptions, FontStyle, ShikiInternal, ThemeRegistrationResolved, ThemedToken, ThemedTokenScopeExplanation, TokenizeWithThemeOptions } from './types'
import { StackElementMetadata } from './stack-element-metadata'
import { applyColorReplacements, isNoneTheme, isPlainLang, resolveColorReplacements, splitLines } from './utils'
import { tokenizeAnsiWithTheme } from './code-to-tokens-ansi'

/**
 * Code to tokens, with a simple theme.
 */
export function codeToTokensBase(
  internal: ShikiInternal,
  code: string,
  options: CodeToTokensBaseOptions = {},
): ThemedToken[][] {
  const {
    lang = 'text',
    theme: themeName = internal.getLoadedThemes()[0],
  } = options

  if (isPlainLang(lang) || isNoneTheme(themeName))
    return splitLines(code).map(line => [{ content: line[0], offset: line[1] }])

  const { theme, colorMap } = internal.setTheme(themeName)

  if (lang === 'ansi')
    return tokenizeAnsiWithTheme(theme, code, options)

  const _grammar = internal.getLanguage(lang)
  return tokenizeWithTheme(code, _grammar, theme, colorMap, options)
}

/** for explanations */
interface ThemeSettingsSelectors {
  settings: IRawThemeSetting
  selectors: string[][]
}

export function tokenizeWithTheme(
  code: string,
  grammar: IGrammar,
  theme: ThemeRegistrationResolved,
  colorMap: string[],
  options: TokenizeWithThemeOptions,
): ThemedToken[][] {
  const colorReplacements = resolveColorReplacements(theme, options)

  const {
    tokenizeMaxLineLength = 0,
    tokenizeTimeLimit = 500,
  } = options

  const lines = splitLines(code)

  let ruleStack = INITIAL
  let actual: ThemedToken[] = []
  const final: ThemedToken[][] = []

  const themeSettingsSelectors: ThemeSettingsSelectors[] = []
  if (options.includeExplanation) {
    for (const setting of theme.settings) {
      let selectors: string[]
      switch (typeof setting.scope) {
        case 'string':
          selectors = setting.scope.split(/,/).map(scope => scope.trim())
          break
        case 'object':
          selectors = setting.scope
          break
        default:
          continue
      }

      themeSettingsSelectors.push({
        settings: setting,
        selectors: selectors.map(selector => selector.split(/ /)),
      })
    }
  }

  for (let i = 0, len = lines.length; i < len; i++) {
    const [line, lineOffset] = lines[i]
    if (line === '') {
      actual = []
      final.push([])
      continue
    }

    // Do not attempt to tokenize if the line length is longer than the `tokenizationMaxLineLength`
    if (tokenizeMaxLineLength > 0 && line.length >= tokenizeMaxLineLength) {
      actual = []
      final.push([{
        content: line,
        offset: lineOffset,
        color: '',
        fontStyle: 0,
      }])
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

    const result = grammar.tokenizeLine2(line, ruleStack, tokenizeTimeLimit)

    const tokensLength = result.tokens.length / 2
    for (let j = 0; j < tokensLength; j++) {
      const startIndex = result.tokens[2 * j]
      const nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length
      if (startIndex === nextStartIndex)
        continue

      const metadata = result.tokens[2 * j + 1]
      const color = applyColorReplacements(
        colorMap[StackElementMetadata.getForeground(metadata)],
        colorReplacements,
      )
      const fontStyle: FontStyle = StackElementMetadata.getFontStyle(metadata)

      const token: ThemedToken = {
        content: line.substring(startIndex, nextStartIndex),
        offset: lineOffset + startIndex,
        color,
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
            scopes: explainThemeScopes(themeSettingsSelectors, tokenWithScopes.scopes),
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
  themeSelectors: ThemeSettingsSelectors[],
  scopes: string[],
): ThemedTokenScopeExplanation[] {
  const result: ThemedTokenScopeExplanation[] = []
  for (let i = 0, len = scopes.length; i < len; i++) {
    const parentScopes = scopes.slice(0, i)
    const scope = scopes[i]
    result[i] = {
      scopeName: scope,
      themeMatches: explainThemeScope(themeSelectors, scope, parentScopes),
    }
  }
  return result
}

function matchesOne(selector: string, scope: string): boolean {
  return selector === scope
    || (scope.substring(0, selector.length) === selector && scope[selector.length] === '.')
}

function matches(
  selectors: string[],
  scope: string,
  parentScopes: string[],
): boolean {
  if (!matchesOne(selectors[selectors.length - 1], scope))
    return false

  let selectorParentIndex = selectors.length - 2
  let parentIndex = parentScopes.length - 1
  while (selectorParentIndex >= 0 && parentIndex >= 0) {
    if (matchesOne(selectors[selectorParentIndex], parentScopes[parentIndex]))
      selectorParentIndex -= 1
    parentIndex -= 1
  }

  if (selectorParentIndex === -1)
    return true

  return false
}

function explainThemeScope(
  themeSettingsSelectors: ThemeSettingsSelectors[],
  scope: string,
  parentScopes: string[],
): IRawThemeSetting[] {
  const result: IRawThemeSetting[] = []
  for (const { selectors, settings } of themeSettingsSelectors) {
    for (const selectorPieces of selectors) {
      if (matches(selectorPieces, scope, parentScopes)) {
        result.push(settings)
        break // continue to the next theme settings
      }
    }
  }
  return result
}
