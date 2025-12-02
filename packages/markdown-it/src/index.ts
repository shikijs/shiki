import type MarkdownIt from 'markdown-it'
import type { BuiltinLanguage, BuiltinTheme, LanguageInput } from 'shiki'
import type { MarkdownItShikiSetupOptions } from './common'
import { bundledLanguages, createHighlighter } from 'shiki'
import { setupMarkdownIt } from './core'

export * from './core'

export type MarkdownItShikiOptions = MarkdownItShikiSetupOptions & {
  /**
   * Language names to include.
   *
   * **Performance Tip**: Loading all languages can be slow. For better performance,
   * specify only the languages you need instead of using the default.
   *
   * @default Object.keys(bundledLanguages) - loads all available languages (slow)
   * @example ['javascript', 'typescript', 'markdown']
   */
  langs?: Array<LanguageInput | BuiltinLanguage>

  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, string>

  /**
   * Emit console warnings to alert users of potential issues.
   * @default true
   */
  warnings?: boolean
}

export default async function markdownItShiki(options: MarkdownItShikiOptions) {
  const themeNames = ('themes' in options
    ? Object.values(options.themes)
    : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const allBundledLanguages = Object.keys(bundledLanguages)
  const langs = options.langs || allBundledLanguages
  const langAlias = options.langAlias || {}

  // Warn about performance when loading all languages
  if (!options.langs && options.warnings !== false) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Shiki] Loading all ${allBundledLanguages.length} languages, which can be slow. ` +
      `For better performance, specify only the languages you need using the \`langs\` option. ` +
      `Example: \`langs: ['javascript', 'typescript', 'markdown']\``
    )
  }

  const highlighter = await createHighlighter({
    themes: themeNames,
    langs,
    langAlias,
    warnings: options.warnings,
  })

  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options)
  }
}
