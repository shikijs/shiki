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
   * The fallback language to use when specified language is not loaded
   */
  fallbackLanguage?: string

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

const languagePrefix = 'language-'

function rehypeShikiFromHighlighter(
  highlighter: HighlighterGeneric<any, any>,
  options: RehypeShikiCoreOptions,
): Transformer<Root, Root> {
  const langs = highlighter.getLoadedLanguages()
  const {
    addLanguageClass = false,
    parseMetaString,
    cache,
    defaultLanguage,
    fallbackLanguage,
    onError,
    ...rest
  } = options

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
          d => typeof d === 'string' && d.startsWith(languagePrefix),
        )
        : undefined

      let lang = typeof languageClass === 'string' ? languageClass.slice(languagePrefix.length) : defaultLanguage

      if (!lang)
        return

      if (fallbackLanguage && !langs.includes(lang))
        lang = fallbackLanguage

      const code = toString(head)
      const cachedValue = cache?.get(code)

      if (cachedValue) {
        parent.children.splice(index, 1, ...cachedValue)
        return
      }

      const metaString = head.data?.meta ?? head.properties.metastring?.toString() ?? ''
      const meta = parseMetaString?.(metaString, node, tree) || {}

      const codeOptions: CodeToHastOptions = {
        ...rest,
        lang,
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
            this.addClassToHast(node, `${languagePrefix}${lang}`)
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
