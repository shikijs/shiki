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
   * @default Object.keys(bundledLanguages)
   */
  langs?: Array<LanguageInput | BuiltinLanguage>

  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, string>
}

export default async function markdownItShiki(options: MarkdownItShikiOptions) {
  const themeNames = ('themes' in options
    ? Object.values(options.themes)
    : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const langs = options.langs || Object.keys(bundledLanguages)
  const langAlias = options.langAlias || {}

  const highlighter = await createHighlighter({
    themes: themeNames,
    langs,
    langAlias,
  })

  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options)
  }
}
