import type { ThemeRegistrationAny, ThemeRegistrationResolved } from './types'

/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' }
const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' }

const RESOLVED_KEY = '__shiki_resolved'

/**
 * Normalize a textmate theme to shiki theme
 */
export function normalizeTheme(rawTheme: ThemeRegistrationAny): ThemeRegistrationResolved {
  // @ts-expect-error private field
  if (rawTheme?.[RESOLVED_KEY])
    return rawTheme as ThemeRegistrationResolved

  const theme = {
    ...rawTheme,
  } as ThemeRegistrationResolved

  // Fallback settings
  if (theme.tokenColors && !theme.settings) {
    theme.settings = theme.tokenColors
    delete theme.tokenColors
  }

  theme.type ||= 'dark'
  theme.colorReplacements = { ...theme.colorReplacements }
  theme.settings ||= []

  // Guess fg/bg colors
  let { bg, fg } = theme
  if (!bg || !fg) {
    /**
     * First try:
     * Theme might contain a global `tokenColor` without `name` or `scope`
     * Used as default value for foreground/background
     */
    const globalSetting = theme.settings
      ? theme.settings.find((s: any) => !s.name && !s.scope)
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
      fg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark
    if (!bg)
      bg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark

    theme.fg = fg
    theme.bg = bg
  }
  // Push a no-scope setting with fallback colors
  if (!(theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope)) {
    theme.settings.unshift({
      settings: {
        foreground: theme.fg,
        background: theme.bg,
      },
    })
  }

  // Push non-hex colors to color replacements, as `vscode-textmate` doesn't support them
  let replacementCount = 0
  const replacementMap = new Map<string, string>()
  function getReplacementColor(value: string) {
    if (replacementMap.has(value))
      return replacementMap.get(value)!
    replacementCount += 1
    const hex = `#${replacementCount.toString(16).padStart(8, '0').toLowerCase()}`
    if (theme.colorReplacements?.[`#${hex}`]) // already exists
      return getReplacementColor(value)
    replacementMap.set(value, hex)
    return hex
  }
  theme.settings = theme.settings.map((setting) => {
    const replaceFg = setting.settings?.foreground && !setting.settings.foreground.startsWith('#')
    const replaceBg = setting.settings?.background && !setting.settings.background.startsWith('#')
    if (!replaceFg && !replaceBg)
      return setting
    const clone = {
      ...setting,
      settings: {
        ...setting.settings,
      },
    }
    if (replaceFg) {
      const replacement = getReplacementColor(setting.settings.foreground)
      theme.colorReplacements![replacement] = setting.settings.foreground
      clone.settings.foreground = replacement
    }
    if (replaceBg) {
      const replacement = getReplacementColor(setting.settings.background)
      theme.colorReplacements![replacement] = setting.settings.background
      clone.settings.background = replacement
    }
    return clone
  })
  for (const key of Object.keys(theme.colors || {})) {
    // Only patch for known keys
    if (key === 'editor.foreground' || key === 'editor.background' || key.startsWith('terminal.ansi')) {
      if (!theme.colors![key]?.startsWith('#')) {
        const replacement = getReplacementColor(theme.colors![key])
        theme.colorReplacements![replacement] = theme.colors![key]
        theme.colors![key] = replacement
      }
    }
  }

  Object.defineProperty(theme, RESOLVED_KEY, {
    enumerable: false,
    writable: false,
    value: true,
  })

  return theme
}
