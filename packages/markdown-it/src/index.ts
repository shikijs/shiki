import type MarkdownIt from 'markdown-it'
import { bundledLanguages, createHighlighter } from 'shiki'
import type { BuiltinLanguage, BuiltinTheme, LanguageInput } from 'shiki'
import type { MarkdownItShikiSetupOptions } from './core'
import { setupMarkdownIt } from './core'

export * from './core'

export type MarkdownItShikiOptions = MarkdownItShikiSetupOptions & {
  /**
   * Language names to include.
   *
   * @default Object.keys(bundledLanguages)
   */
  langs?: Array<LanguageInput | BuiltinLanguage>
}

export default async function markdownItShiki(options: MarkdownItShikiOptions) {
  const themeNames = ('themes' in options
    ? Object.values(options.themes)
    : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const highlighter = await createHighlighter({
    themes: themeNames,
    langs: options.langs || Object.keys(bundledLanguages) as BuiltinLanguage[],
  })

  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options)
  }
}
