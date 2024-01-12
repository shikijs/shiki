import { addClassToHast } from 'shikiji/core'
import type { CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, HighlighterGeneric, TransformerOptions } from 'shikiji/core'
import type { Element, Root } from 'hast'
import type { BuiltinTheme } from 'shikiji'
import type { Plugin } from 'unified'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { parseHighlightLines } from '../../shared/line-highlight'

export interface MapLike<K = any, V = any> {
  get(key: K): V | undefined
  set(key: K, value: V): this
}

export interface RehypeShikijiExtraOptions {
  /**
   * Add `highlighted` class to lines defined in after codeblock
   *
   * @default true
   */
  highlightLines?: boolean | string

  /**
   * Add `language-*` class to code element
   *
   * @default false
   */
  addLanguageClass?: boolean

  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   */
  parseMetaString?: (
    metaString: string,
    node: Element,
    tree: Root
  ) => Record<string, any> | undefined | null

  /**
   * Custom map to cache transformed codeToHast result
   *
   * @default undefined
   */
  cache?: MapLike

  /**
   * Chance to handle the error
   * If not provided, the error will be thrown
   */
  onError?: (error: unknown) => void
}

export type RehypeShikijiCoreOptions =
  & CodeOptionsThemes<BuiltinTheme>
  & TransformerOptions
  & CodeOptionsMeta
  & RehypeShikijiExtraOptions

const rehypeShikijiFromHighlighter: Plugin<[HighlighterGeneric<any, any>, RehypeShikijiCoreOptions], Root> = function (
  highlighter,
  options,
) {
  const {
    highlightLines = true,
    addLanguageClass = false,
    parseMetaString,
    cache,
    ...rest
  } = options

  const prefix = 'language-'

  return function (tree) {
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

      const cachedValue = cache?.get(code)

      if (cachedValue) {
        parent.children.splice(index, 1, ...cachedValue)
        return
      }

      const attrs = (head.data as any)?.meta
      const meta = parseMetaString?.(attrs, node, tree) || {}

      const codeOptions: CodeToHastOptions = {
        ...rest,
        lang: language.slice(prefix.length),
        meta: {
          ...rest.meta,
          ...meta,
          __raw: attrs,
        },
      }

      if (addLanguageClass) {
        codeOptions.transformers ||= []
        codeOptions.transformers.push({
          name: 'rehype-shikiji:code-language-class',
          code(node) {
            addClassToHast(node, language)
            return node
          },
        })
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

      try {
        const fragment = highlighter.codeToHast(code, codeOptions)
        cache?.set(code, fragment.children)
        parent.children.splice(index, 1, ...fragment.children)
      }
      catch (error) {
        if (options.onError)
          options.onError(error)
        else
          throw error
      }
    })
  }
}

export default rehypeShikijiFromHighlighter
