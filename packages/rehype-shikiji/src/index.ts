import type { BuiltinLanguage, BuiltinTheme, CodeOptionsThemes, CodeToHastOptions, LanguageInput } from 'shikiji'
import { addClassToHast, bundledLanguages, getHighlighter } from 'shikiji'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Element, Root } from 'hast'
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

  /**
   * Extra meta data to pass to the highlighter
   */
  meta?: Record<string, any>

  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   */
  parseMetaString?: (
    metaString: string,
    node: Element,
    tree: Root
  ) => Record<string, any> | undefined | null
}

const rehypeShikiji: Plugin<[RehypeShikijiOptions], Root> = function (options = {} as any) {
  const {
    highlightLines = true,
    parseMetaString,
    ...rest
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
      const attrs = (head.data as any)?.meta
      const meta = parseMetaString?.(attrs, node, tree) || {}

      const codeOptions: CodeToHastOptions = {
        ...rest,
        lang: language.slice(prefix.length),
        meta: {
          ...rest.meta,
          ...meta,
        },
      }

      if (highlightLines && typeof attrs === 'string') {
        const lines = parseHighlightLines(attrs)
        if (lines) {
          const className = highlightLines === true
            ? 'highlighted'
            : highlightLines

          codeOptions.transformers ||= []
          codeOptions.transformers.push({
            name: 'rehype-shikiji:line-class',
            line(node, line) {
              if (lines.includes(line))
                addClassToHast(node, className)
              return node
            },
          })
        }
      }
      const fragment = highlighter.codeToHast(code, codeOptions)
      parent.children.splice(index, 1, ...fragment.children)
    })
  }
}

export default rehypeShikiji
