import type { CodeToTokensBaseOptions, ShikiPrimitive, ThemedToken } from '@shikijs/types'
import { getLastGrammarState, codeToTokensBase as tokenizerCodeToTokensBase, tokenizeWithTheme } from '@shikijs/primitive'
import { isNoneTheme, isPlainLang } from '../utils'
import { tokenizeAnsiWithTheme } from './code-to-tokens-ansi'

export { getLastGrammarState, tokenizeWithTheme }

/**
 * Code to tokens, with a simple theme.
 * This wraps the tokenizer's implementation to add ANSI support.
 */
export function codeToTokensBase(
  primitive: ShikiPrimitive,
  code: string,
  options: CodeToTokensBaseOptions = {},
): ThemedToken[][] {
  const lang = primitive.resolveLangAlias(options.lang || 'text')
  const { theme: themeName = primitive.getLoadedThemes()[0] } = options

  // Intercept 'ansi' before delegating to tokenizer (tokenizer doesn't support ANSI)
  if (!isPlainLang(lang) && !isNoneTheme(themeName) && lang === 'ansi') {
    const { theme } = primitive.setTheme(themeName)
    return tokenizeAnsiWithTheme(theme, code, options)
  }

  return tokenizerCodeToTokensBase(primitive, code, options)
}
