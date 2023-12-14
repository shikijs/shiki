import type MarkdownIt from 'markdown-it'
import { bundledLanguages, getHighlighter } from 'shikiji'
import type { BuiltinLanguage, BuiltinTheme, LanguageInput } from 'shikiji'
import type { MarkdownItShikijiSetupOptions } from './core'
import { setupMarkdownIt } from './core'

export * from './core'

export type MarkdownItShikijiOptions = MarkdownItShikijiSetupOptions & {
  /**
   * Language names to include.
   *
   * @default Object.keys(bundledLanguages)
   */
  langs?: Array<LanguageInput | BuiltinLanguage>
}

export default async function markdownItShikiji(options: MarkdownItShikijiOptions) {
  const themeNames = ('themes' in options
    ? Object.values(options.themes)
    : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const highlighter = await getHighlighter({
    themes: themeNames,
    langs: options.langs || Object.keys(bundledLanguages) as BuiltinLanguage[],
  })

  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options)
  }
}
