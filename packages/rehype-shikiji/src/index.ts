import type { BuiltinLanguage, BuiltinTheme, CodeOptionsThemes, LanguageInput } from 'shikiji'
import { bundledLanguages, getHighlighter } from 'shikiji'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import type { CodeToHastOptions } from '../../shikiji/dist/core.mjs'
import { parseHighlightLines } from '../../shared/line-highlight'

export type RehypeShikijiOptions = CodeOptionsThemes<BuiltinTheme> & {
  /**
   * Language names to include.
   *
   * @default Object.keys(bundledLanguages)
   */
  langs?: Array<LanguageInput | BuiltinLanguage>

  /**
   * Add `highlighted` class to lines defined in after codeblock
   *
   * @default true
   */
  highlightLines?: boolean | string
}

const rehypeShikiji: Plugin<[RehypeShikijiOptions], Root> = function (options = {} as any) {
  const {
    highlightLines = true,
  } = options

  const prefix = 'language-'
  const themeNames = ('themes' in options ? Object.values(options.themes) : [options.theme]).filter(Boolean) as BuiltinTheme[]
  const promise = getHighlighter({
    themes: themeNames,
    langs: options.langs || Object.keys(bundledLanguages) as BuiltinLanguage[],
  })

  return async function (tree) {
    const highlighter = await promise

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null || node.tagName !== 'pre')
        return

      const head = node.children[0]

      if (
        !head
        || head.type !== 'element'
        || head.tagName !== 'code'
        || !head.properties
      )
        return

      const classes = head.properties.className

      if (!Array.isArray(classes))
        return

      const language = classes.find(
        d => typeof d === 'string' && d.startsWith(prefix),
      )

      if (typeof language !== 'string')
        return

      const code = toString(head as any)
      const codeOptions: CodeToHastOptions = {
        ...options,
        lang: language.slice(prefix.length),
      }

      const attrs = (head.data as any)?.meta
      if (highlightLines && typeof attrs === 'string') {
        const lines = parseHighlightLines(attrs)
        if (lines) {
          const className = highlightLines === true
            ? 'highlighted'
            : highlightLines

          codeOptions.transforms ||= {}
          codeOptions.transforms.line = (node, line) => {
            if (lines.includes(line))
              node.properties.class += ` ${className}`
            return node
          }
        }
      }

      const fragment = highlighter.codeToHast(code, codeOptions)

      parent.children.splice(index, 1, ...fragment.children)
    })
  }
}

export default rehypeShikiji
