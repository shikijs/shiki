import type { LanguageInput } from 'shiki/core'
import type { BuiltinLanguage, BuiltinTheme } from 'shiki'
import { bundledLanguages, getHighlighter } from 'shiki'
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import rehypeShikiFromHighlighter from './core'
import type { RehypeShikiCoreOptions } from './core'

export type RehypeShikiOptions = RehypeShikiCoreOptions
  & {
    /**
     * Language names to include.
     *
     * @default Object.keys(bundledLanguages)
     */
    langs?: Array<LanguageInput | BuiltinLanguage>
  }

const rehypeShiki: Plugin<[RehypeShikiOptions], Root> = function (
  options = {} as any,
) {
  const themeNames = ('themes' in options ? Object.values(options.themes) : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const langs = options.langs || Object.keys(bundledLanguages)

  // eslint-disable-next-line ts/no-this-alias
  const ctx = this
  let promise: Promise<any>

  return async function (tree) {
    if (!promise) {
      promise = getHighlighter({
        themes: themeNames,
        langs,
      })
        .then(highlighter => rehypeShikiFromHighlighter.call(ctx, highlighter, options))
    }
    const handler = await promise
    return handler!(tree) as Root
  }
}

export default rehypeShiki
