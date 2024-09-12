import type {
  CodeToHastOptions,
  HighlighterGeneric,
} from '@shikijs/types'
import type { Element, Root } from 'hast'
import type { Transformer } from 'unified'
import type { RehypeShikiCoreOptions } from './types'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { InlineCodeProcessors } from './inline'

export * from './types'

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

  function highlight(
    lang: string,
    code: string,
    metaString: string = '',
    meta: Record<string, unknown> = {},
  ): Root | undefined {
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
      else
        throw error
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

    const lang = getLanguage(
      typeof languageClass === 'string'
        ? languageClass.slice(languagePrefix.length)
        : undefined,
    )

    if (!lang)
      return

    const code = toString(head)
    const metaString = head.data?.meta ?? head.properties.metastring?.toString() ?? ''
    const meta = parseMetaString?.(metaString, node, tree) || {}

    return highlight(lang, code, metaString, meta)
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
        const result = InlineCodeProcessors[inline]?.({ node, getLanguage, highlight })
        if (result) {
          parent.children.splice(index, 1, ...result.children)
        }
      }
    })
  }
}

export default rehypeShikiFromHighlighter
