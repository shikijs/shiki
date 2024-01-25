import type { LanguageInput } from 'shikiji/core'
import type { BuiltinLanguage, BuiltinTheme } from 'shikiji'
import { bundledLanguages, getHighlighter } from 'shikiji'
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import rehypeShikijiFromHighlighter from './core'
import type { RehypeShikijiCoreOptions } from './core'

export type RehypeShikijiOptions = RehypeShikijiCoreOptions
  & {
    /**
     * Language names to include.
     *
     * @default Object.keys(bundledLanguages)
     */
    langs?: Array<LanguageInput | BuiltinLanguage>
  }

const rehypeShikiji: Plugin<[RehypeShikijiOptions], Root> = function (
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
        .then(highlighter => rehypeShikijiFromHighlighter.call(ctx, highlighter, options))
    }
    const handler = await promise
    return handler!(tree) as Root
  }
}

export default rehypeShikiji
