/// <reference types="mdast-util-to-hast" />

import type { LanguageInput } from '@shikijs/types'
import type { Root } from 'hast'
import type { BuiltinLanguage, BuiltinTheme } from 'shiki'
import type { Plugin } from 'unified'
import type { RehypeShikiCoreOptions } from './types'
import { bundledLanguages, getSingletonHighlighter } from 'shiki'
import rehypeShikiFromHighlighter from './core'

export type RehypeShikiOptions = RehypeShikiCoreOptions
  & {
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

const rehypeShiki: Plugin<[RehypeShikiOptions], Root> = function (
  options = {} as RehypeShikiOptions,
) {
  const themeNames = ('themes' in options ? Object.values(options.themes) : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const langs = options.langs || Object.keys(bundledLanguages)
  const langAlias = options.langAlias || {}

  let getHandler: Promise<any>

  return async (tree) => {
    if (!getHandler) {
      getHandler = getSingletonHighlighter({
        themes: themeNames,
        langs,
        langAlias,
      })
        .then(highlighter => rehypeShikiFromHighlighter.call(this, highlighter, options))
    }
    const handler = await getHandler
    return handler!(tree) as Root
  }
}

export default rehypeShiki
