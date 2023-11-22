import fs from 'node:fs'
import fsp from 'node:fs/promises'
import type { BuiltinLanguage, BuiltinTheme, CodeToThemedTokensOptions, MaybeGetter, StringLiteralUnion, ThemeInput, ThemeRegistration, ThemedToken } from 'shikiji'
import { bundledLanguages, bundledThemes, getHighlighter as getShikiji, toShikiTheme } from 'shikiji'
import { transformerCompactLineOptions } from 'shikiji-transformers'
import type { AnsiToHtmlOptions, CodeToHtmlOptions, CodeToHtmlOptionsExtra, HighlighterOptions } from './types'

export const BUNDLED_LANGUAGES = bundledLanguages
export const BUNDLED_THEMES = bundledThemes

export * from './stub'
export * from './types'

export { toShikiTheme } from 'shikiji'

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

  function codeToHtml(code: string, options: CodeToHtmlOptions): string
  /** @deprecated pass the second argument as object instead */
  function codeToHtml(code: string, lang: StringLiteralUnion<BuiltinLanguage>, theme?: StringLiteralUnion<BuiltinTheme>, options?: CodeToHtmlOptionsExtra): string
  function codeToHtml(code: string, arg1: any, arg2?: StringLiteralUnion<BuiltinTheme>, options2?: CodeToHtmlOptionsExtra): string {
    const options: CodeToHtmlOptions = (
      typeof arg1 === 'string'
        ? options2
        : arg1
    ) || {}

    if (typeof arg1 === 'string')
      options.lang ||= arg1

    if (!('themes' in options)) {
      // @ts-expect-error when `themes` is not in options, `theme` has to be a string
      options.theme = 'theme' in options
        ? (options.theme || defaultTheme)
        : arg2 || defaultTheme
    }

    if (options.lineOptions) {
      options.transformers ||= []
      options.transformers.push(transformerCompactLineOptions(options.lineOptions))
    }

    return shikiji.codeToHtml(code, options as any)
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

export type Highlighter = Awaited<ReturnType<typeof getHighlighter>>

export async function loadTheme(theme: BuiltinTheme | ThemeInput): Promise<ThemeRegistration> {
  if (typeof theme === 'string') {
    if (bundledThemes[theme] != null)
      return toShikiTheme(await bundledThemes[theme]().then(r => r.default))

    // provide as a path
    if (fs.existsSync(theme) && theme.endsWith('.json'))
      return toShikiTheme(JSON.parse(await fsp.readFile(theme, 'utf-8')))

    throw new Error(`[shikiji-compat] Unknown theme: ${theme}`)
  }
  else {
    return toShikiTheme(await normalizeGetter(theme))
  }
}

async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
  return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
}

export default getHighlighter
