import type { CodeToTokensBaseOptions, ShikiInternal, ThemedToken } from '@shikijs/types'
import { getLastGrammarState, codeToTokensBase as tokenizerCodeToTokensBase, tokenizeWithTheme } from '@shikijs/tokenizer'
import { isNoneTheme, isPlainLang } from '../utils'
import { tokenizeAnsiWithTheme } from './code-to-tokens-ansi'

export { getLastGrammarState, tokenizeWithTheme }

/**
 * Code to tokens, with a simple theme.
 * This wraps the tokenizer's implementation to add ANSI support.
 */
export function codeToTokensBase(
  internal: ShikiInternal,
  code: string,
  options: CodeToTokensBaseOptions = {},
): ThemedToken[][] {
  const lang = internal.resolveLangAlias(options.lang || 'text')
  const { theme: themeName = internal.getLoadedThemes()[0] } = options

  // Intercept 'ansi' before delegating to tokenizer (tokenizer doesn't support ANSI)
  if (!isPlainLang(lang) && !isNoneTheme(themeName) && lang === 'ansi') {
    const { theme } = internal.setTheme(themeName)
    return tokenizeAnsiWithTheme(theme, code, options)
  }

  return tokenizerCodeToTokensBase(internal, code, options)
}
