import { warnDeprecated } from '@shikijs/core'

export { createCssVariablesTheme } from './core'
export type { CssVariablesThemeOptions } from './core'

warnDeprecated('`shiki/theme-css-variables` entry point is deprecated. Use `shiki/core` instead.')
