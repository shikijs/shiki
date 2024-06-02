import type { CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, HighlighterGeneric, TransformerOptions } from 'shiki/core'
import type { Element, Root } from 'hast'
import type { BuiltinTheme } from 'shiki'
import type { Transformer } from 'unified'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'

export interface MapLike<K = any, V = any> {
  get: (key: K) => V | undefined
  set: (key: K, value: V) => this
}

export interface RehypeShikiExtraOptions {
  /**
   * Add `language-*` class to code element
   *
   * @default false
   */
  addLanguageClass?: boolean

  /**
   * The default language to use when is not specified
   */
  defaultLanguage?: string

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

function rehypeShikiFromHighlighter(
  highlighter: HighlighterGeneric<any, any>,
  {
    addLanguageClass = false,
    parseMetaString,
    cache,
    defaultLanguage,
    onError,
    ...rest
  }: RehypeShikiCoreOptions,
): Transformer<Root, Root> {
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
      ) {
        return
      }

      const classes = head.properties.className
      const languageClass = Array.isArray(classes)
        ? classes.find(
          d => typeof d === 'string' && d.startsWith(prefix),
        )
        : undefined

      const language = typeof languageClass === 'string' ? languageClass.slice(prefix.length) : defaultLanguage
      if (!language)
        return

      const code = toString(head)
      const cachedValue = cache?.get(code)

      if (cachedValue) {
        parent.children.splice(index, 1, ...cachedValue)
        return
      }

      const metaString = head.data?.meta ?? head.properties.metastring ?? ''
      const meta = parseMetaString?.(metaString, node, tree) || {}

      const codeOptions: CodeToHastOptions = {
        ...rest,
        lang: language,
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
            this.addClassToHast(node, `${prefix}${language}`)
            return node
          },
        })
      }

      try {
        const fragment = highlighter.codeToHast(code, codeOptions)
        cache?.set(code, fragment.children)
        parent.children.splice(index, 1, ...fragment.children)
      }
      catch (error) {
        if (onError)
          onError(error)
        else
          throw error
      }
    })
  }
}

export default rehypeShikiFromHighlighter
