import type { ThemeRegistration, ThemeRegistrationRaw } from './types'

/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' }
const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' }

/**
 * Normalize a textmate theme to shiki theme
 */
export function toShikiTheme(rawTheme: ThemeRegistrationRaw | ThemeRegistration): ThemeRegistration {
  if (['settings', 'type', 'bg', 'fg'].every(key => key in rawTheme))
    return rawTheme as ThemeRegistration

  const type = (<any>rawTheme).type || 'dark'

  const shikiTheme = {
    name: rawTheme.name!,
    type,
    ...rawTheme,
  } as ThemeRegistration

  if (shikiTheme.tokenColors && !shikiTheme.settings) {
    shikiTheme.settings = shikiTheme.tokenColors
    delete shikiTheme.tokenColors
  }

  repairTheme(shikiTheme)

  return shikiTheme
}

export function repairTheme(theme: ThemeRegistration) {
  const type = theme.type || 'dark'

  // Has the default no-scope setting with fallback colors
  if (!theme.settings)
    theme.settings = []

  let { bg, fg } = theme
  if (!bg || !fg) {
    /**
     * First try:
     * Theme might contain a global `tokenColor` without `name` or `scope`
     * Used as default value for foreground/background
     */
    const settings = theme.settings
    const globalSetting = settings
      ? settings.find((s: any) => !s.name && !s.scope)
      : undefined

    if (globalSetting?.settings?.foreground)
      fg = globalSetting.settings.foreground

    if (globalSetting?.settings?.background)
      bg = globalSetting.settings.background

    /**
     * Second try:
     * If there's no global `tokenColor` without `name` or `scope`
     * Use `editor.foreground` and `editor.background`
     */
    if (!fg && (<any>theme)?.colors?.['editor.foreground'])
      fg = (<any>theme).colors['editor.foreground']

    if (!bg && (<any>theme)?.colors?.['editor.background'])
      bg = (<any>theme).colors['editor.background']

    /**
     * Last try:
     * If there's no fg/bg color specified in theme, use default
     */
    if (!fg)
      fg = type === 'light' ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark
    if (!bg)
      bg = type === 'light' ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark

    theme.fg = fg
    theme.bg = bg
  }

  if (!(theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope)) {
    // Push a no-scope setting with fallback colors
    theme.settings.unshift({
      settings: {
        foreground: theme.fg,
        background: theme.bg,
      },
    })
  }
}
