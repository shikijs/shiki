import { addClassToHast } from 'shiki/core'
import type { CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, HighlighterGeneric, TransformerOptions } from 'shiki/core'
import type { Element, Root } from 'hast'
import type { BuiltinTheme } from 'shiki'
import type { Plugin } from 'unified'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { transformerMetaHighlight } from '@shikijs/transformers'

export interface MapLike<K = any, V = any> {
  get(key: K): V | undefined
  set(key: K, value: V): this
}

export interface RehypeShikiExtraOptions {
  /**
   * Add `highlighted` class to lines defined in after codeblock
   *
   * @deprecated Use [transformerNotationHighlight](https://shiki.netlify.app/packages/transformers#transformernotationhighlight) instead
   * @default false
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

export type RehypeShikiCoreOptions =
  & CodeOptionsThemes<BuiltinTheme>
  & TransformerOptions
  & CodeOptionsMeta
  & RehypeShikiExtraOptions

declare module 'hast' {
  interface Data {
    meta?: string
  }
  interface Properties {
    metastring?: string
  }
}

const rehypeShikiFromHighlighter: Plugin<[HighlighterGeneric<any, any>, RehypeShikiCoreOptions], Root> = function (
  highlighter,
  options,
) {
  const {
    highlightLines = false,
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

      const metaString = head.data?.meta ?? head.properties.metastring ?? ''
      const meta = parseMetaString?.(metaString, node, tree) || {}

      const codeOptions: CodeToHastOptions = {
        ...rest,
        lang: language.slice(prefix.length),
        meta: {
          ...rest.meta,
          ...meta,
          __raw: metaString,
        },
      }

      if (addLanguageClass) {
        codeOptions.transformers ||= []
        codeOptions.transformers.push({
          name: 'rehype-shiki:code-language-class',
          code(node) {
            addClassToHast(node, language)
            return node
          },
        })
      }

      if (highlightLines && typeof metaString === 'string') {
        codeOptions.transformers ||= []
        codeOptions.transformers.push(
          transformerMetaHighlight({
            className: highlightLines === true
              ? 'highlighted'
              : highlightLines,
          }),
        )
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

export default rehypeShikiFromHighlighter
