import type { BuiltinLanguage, BuiltinTheme, BundledHighlighterOptions, CodeToHastOptions, CodeToThemedTokensOptions, LineOption, StringLiteralUnion, ThemedToken } from 'shikiji'
import { bundledLanguages, bundledThemes, getHighlighter as getShikiji } from 'shikiji'

export const BUNDLED_LANGUAGES = bundledLanguages
export const BUNDLED_THEMES = bundledThemes

export * from './stub'

export interface AnsiToHtmlOptions {
  theme?: StringLiteralUnion<BuiltinTheme>
  lineOptions?: LineOption[]
}

export interface HighlighterOptions extends BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme> {
  theme?: BuiltinTheme
}

export async function getHighlighter(options: HighlighterOptions = {}) {
  const themes = options.themes || []
  const langs = options.langs || []

  if (options.theme)
    themes.unshift(options.theme)
  if (!themes.length)
    themes.push('nord')

  if (!langs.length)
    langs.push(...Object.keys(bundledLanguages) as BuiltinLanguage[])

  const shikiji = await getShikiji({
    ...options,
    themes,
    langs,
  })

  const defaultTheme = shikiji.getLoadedThemes()[0]

  function codeToThemedTokens(code: string, options: CodeToThemedTokensOptions<BuiltinLanguage, BuiltinTheme>): ThemedToken[][]
  function codeToThemedTokens(code: string, lang: BuiltinLanguage, theme?: BuiltinTheme): ThemedToken[][]
  function codeToThemedTokens(code: string, lang: BuiltinLanguage | CodeToThemedTokensOptions<BuiltinLanguage, BuiltinTheme>, theme?: BuiltinTheme): ThemedToken[][] {
    if (typeof lang === 'string') {
      return shikiji.codeToThemedTokens(code, {
        lang,
        theme: (theme || defaultTheme) as BuiltinTheme,
      })
    }
    return shikiji.codeToThemedTokens(code, lang)
  }

  function codeToHtml(code: string, options: Partial<CodeToHastOptions<BuiltinLanguage, BuiltinTheme>>): string
  function codeToHtml(code: string, lang: BuiltinLanguage, theme?: BuiltinTheme): string
  function codeToHtml(code: string, lang: any, theme?: BuiltinTheme): string {
    if (typeof lang === 'string') {
      return shikiji.codeToHtml(code, {
        lang,
        theme: (theme || defaultTheme),
      })
    }
    return shikiji.codeToHtml(code, {
      ...lang,
      theme: (lang.theme || defaultTheme),
    })
  }

  return {
    ...shikiji,
    codeToThemedTokens,
    codeToHtml,
    ansiToHtml(code: string, options?: AnsiToHtmlOptions) {
      return shikiji.codeToHtml(code, {
        lang: 'ansi',
        ...options,
        theme: options?.theme || defaultTheme,
      })
    },
  }
}
