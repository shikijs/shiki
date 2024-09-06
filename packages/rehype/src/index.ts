/// <reference types="mdast-util-to-hast" />

import { bundledLanguages, getSingletonHighlighter } from 'shiki'
import type { Root } from 'hast'
import type { BuiltinLanguage, BuiltinTheme } from 'shiki'
import type { LanguageInput } from 'shiki/core'
import type { Plugin } from 'unified'
import rehypeShikiFromHighlighter from './core'
import type { RehypeShikiCoreOptions } from './types'

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
  options = {} as RehypeShikiOptions,
) {
  const themeNames = ('themes' in options ? Object.values(options.themes) : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const langs = options.langs || Object.keys(bundledLanguages)

  let getHandler: Promise<any>

  return async (tree) => {
    if (!getHandler) {
      getHandler = getSingletonHighlighter({
        themes: themeNames,
        langs,
      })
        .then(highlighter => rehypeShikiFromHighlighter.call(this, highlighter, options))
    }
    const handler = await getHandler
    return handler!(tree) as Root
  }
}

export default rehypeShiki
