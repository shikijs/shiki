import type { CodeToThemedTokensOptions, ShikiContext } from '../types'
import { tokenizeAnsiWithTheme } from './tokenizer-ansi'

export function ansiToThemedTokens(
  context: ShikiContext,
  ansi: string,
  options: CodeToThemedTokensOptions = {},
) {
  const theme = context.getTheme(options.theme || context.getLoadedThemes()[0])
  return tokenizeAnsiWithTheme(theme, ansi)
}
