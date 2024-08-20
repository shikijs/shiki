import type {
  CodeOptionsMeta,
  CodeOptionsThemes,
  CodeToHastOptions,
  CodeToHastOptionsCommon,
  HighlighterGeneric,
  TransformerOptions,
} from 'shiki/core'
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
   * `mdast-util-to-hast` adds a newline to the end of code blocks
   *
   * This option strips that newline from the code block
   *
   * @default true
   * @see https://github.com/syntax-tree/mdast-util-to-hast/blob/f511a93817b131fb73419bf7d24d73a5b8b0f0c2/lib/handlers/code.js#L22
   */
  stripEndNewline?: boolean

  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   */
  parseMetaString?: (
    metaString: string,
    node: Element,
    tree: Root,
  ) => Record<string, any> | undefined | null

  /**
   * Highlight inline code blocks
   *
   * @default false
   */
  inline?: boolean

  /**
   * Custom map to cache transformed codeToHast result
   *
   * @default undefined
   */
  cache?: MapLike<string, Root>

  /**
   * Chance to handle the error
   * If not provided, the error will be thrown
   */
  onError?: (error: unknown) => void
}

export type RehypeShikiCoreOptions = CodeOptionsThemes<BuiltinTheme> &
  TransformerOptions &
  CodeOptionsMeta &
  RehypeShikiExtraOptions &
  Omit<CodeToHastOptionsCommon, 'lang'>

const languagePrefix = 'language-'
const inlineCodeSuffix = /(.+)\{:([\w-]+)\}$/

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
    stripEndNewline = true,
    inline = false,
    ...rest
  } = options

  /**
   * Get the determined language of code block (with default language & fallbacks)
   */
  function getLanguage(lang = defaultLanguage): string | undefined {
    if (lang && fallbackLanguage && !langs.includes(lang))
      return fallbackLanguage

    return lang
  }

  function processCode(lang: string, metaString: string, meta: Record<string, unknown>, code: string): Root | undefined {
    const cacheKey = `${lang}:${metaString}:${code}`
    const cachedValue = cache?.get(cacheKey)

    if (cachedValue) {
      return cachedValue
    }

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
      // always construct a new array, avoid adding the transformer repeatedly
      codeOptions.transformers = [
        ...codeOptions.transformers ?? [],
        {
          name: 'rehype-shiki:code-language-class',
          code(node) {
            this.addClassToHast(node, `${languagePrefix}${lang}`)
            return node
          },
        },
      ]
    }

    if (stripEndNewline && code.endsWith('\n'))
      code = code.slice(0, -1)

    try {
      const fragment = highlighter.codeToHast(code, codeOptions)
      cache?.set(cacheKey, fragment)
      return fragment
    }
    catch (error) {
      if (onError)
        onError(error)
      else throw error
    }
  }

  function processPre(tree: Root, node: Element): Root | undefined {
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

    const lang = getLanguage(typeof languageClass === 'string' ? languageClass.slice(languagePrefix.length) : undefined)

    if (!lang)
      return

    const code = toString(head)
    const metaString
      = head.data?.meta ?? head.properties.metastring?.toString() ?? ''
    const meta = parseMetaString?.(metaString, node, tree) || {}

    return processCode(lang, metaString, meta, code)
  }

  function processInlineCode(node: Element): Root | undefined {
    const raw = toString(node)
    const result = inlineCodeSuffix.exec(raw)
    const lang = getLanguage(result?.[2])
    if (!lang)
      return

    const code = result?.[1] ?? raw
    const fragment = processCode(lang, '', {}, code)
    if (!fragment)
      return

    const head = fragment.children[0]
    if (head.type === 'element' && head.tagName === 'pre') {
      head.tagName = 'span'
    }

    return fragment
  }

  return function (tree) {
    visit(tree, 'element', (node, index, parent) => {
      // needed for hast node replacement
      if (!parent || index == null)
        return

      if (node.tagName === 'pre') {
        const result = processPre(tree, node)

        if (result) {
          parent.children.splice(index, 1, ...result.children)
        }

        // don't look for the `code` node inside
        return 'skip'
      }

      if (node.tagName === 'code' && inline) {
        const result = processInlineCode(node)

        if (result) {
          parent.children.splice(index, 1, ...result.children)
        }
      }
    })
  }
}

export default rehypeShikiFromHighlighter
