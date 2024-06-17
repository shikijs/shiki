import fs from 'node:fs'
import fsp from 'node:fs/promises'
import type { BuiltinLanguage, BuiltinTheme, CodeToTokensBaseOptions, MaybeGetter, StringLiteralUnion, ThemeInput, ThemeRegistrationAny, ThemeRegistrationResolved, ThemedToken } from 'shiki'
import { bundledLanguages, bundledThemes, createHighlighter as getShiki, normalizeTheme, tokenizeAnsiWithTheme } from 'shiki'
import { transformerCompactLineOptions } from '@shikijs/transformers'
import type { AnsiToHtmlOptions, CodeToHtmlOptions, CodeToHtmlOptionsExtra, HighlighterOptions } from './types'
import { ShikiCompatError } from './error'

export const BUNDLED_LANGUAGES = bundledLanguages
export const BUNDLED_THEMES = bundledThemes

export * from './stub'
export * from './types'

export { normalizeTheme } from 'shiki'
export { normalizeTheme as toShikiTheme } from 'shiki'
export { ShikiCompatError } from './error'

export async function getHighlighter(options: Partial<HighlighterOptions> = {}) {
  const themes = options.themes || []
  const langs = options.langs || []

  if (options.theme)
    themes.unshift(options.theme)
  if (!themes.length)
    themes.push('nord')

  if (!langs.length)
    langs.push(...Object.keys(bundledLanguages) as BuiltinLanguage[])

  const shiki = await getShiki({
    ...options,
    themes,
    langs,
  })

  const defaultTheme = shiki.getLoadedThemes()[0]

  function codeToTokensBase(code: string, lang: BuiltinLanguage, theme?: BuiltinTheme, options?: CodeToTokensBaseOptions<BuiltinLanguage, BuiltinTheme>): ThemedToken[][] {
    const tokens = shiki.codeToTokensBase(code, {
      includeExplanation: true,
      lang,
      theme: (theme || defaultTheme) as BuiltinTheme,
      ...options,
    })

    tokens.forEach((line) => {
      line.forEach((token) => {
        // Shiki always provides `explanation` array, even it's disabled
        token.explanation ||= []
        // @ts-expect-error Shiki does not have `offset` in `ThemedToken`
        delete token.offset
      })
    })

    return tokens
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

    return shiki.codeToHtml(code, options as any)
  }

  function ansiToThemedTokens(
    ansi: string,
    options: CodeToTokensBaseOptions = {},
  ) {
    const theme = shiki.getTheme(options.theme || shiki.getLoadedThemes()[0])
    return tokenizeAnsiWithTheme(theme, ansi)
  }

  return {
    ...shiki,
    ansiToThemedTokens,
    codeToTokensBase,
    codeToThemedTokens: codeToTokensBase,
    codeToHtml,
    ansiToHtml(code: string, options?: AnsiToHtmlOptions) {
      return shiki.codeToHtml(code, {
        lang: 'ansi',
        ...options,
        theme: options?.theme || defaultTheme,
      })
    },
    getBackgroundColor(theme: BuiltinTheme | ThemeRegistrationAny | string) {
      return shiki.getTheme(theme).bg
    },
    getForegroundColor(theme: BuiltinTheme | ThemeRegistrationAny | string) {
      return shiki.getTheme(theme).fg
    },

    /**
     * @deprecated Not supported by Shiki
     */
    setColorReplacements(..._args: any[]) {
      throw new ShikiCompatError('`setColorReplacements` is not supported by @shikijs/compat')
    },
  }
}

export type Highlighter = Awaited<ReturnType<typeof getHighlighter>>

export async function loadTheme(theme: BuiltinTheme | ThemeInput): Promise<ThemeRegistrationResolved> {
  if (typeof theme === 'string') {
    if (bundledThemes[theme] != null)
      return normalizeTheme(await bundledThemes[theme]().then(r => r.default))

    // provide as a path
    if (fs.existsSync(theme) && theme.endsWith('.json'))
      return normalizeTheme(JSON.parse(await fsp.readFile(theme, 'utf-8')))

    throw new ShikiCompatError(`Unknown theme: ${theme}`)
  }
  else {
    return normalizeTheme(await normalizeGetter(theme))
  }
}

async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
  return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(r => r.default || r)
}

export default getHighlighter
