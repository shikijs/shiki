import type MarkdownIt from 'markdown-it'
import type { BuiltinTheme, CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, HighlighterGeneric, ShikiTransformer, TransformerOptions } from 'shiki'

export interface MarkdownItShikiExtraOptions {
  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   */
  parseMetaString?: (
    metaString: string,
    code: string,
    lang: string,
  ) => Record<string, any> | undefined | null
}

export type MarkdownItShikiSetupOptions =
  & CodeOptionsThemes<BuiltinTheme>
  & TransformerOptions
  & CodeOptionsMeta
  & MarkdownItShikiExtraOptions

export function setupMarkdownIt(
  markdownit: MarkdownIt,
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownItShikiSetupOptions,
) {
  const {
    parseMetaString,
  } = options

  markdownit.options.highlight = (code, lang = 'text', attrs) => {
    const meta = parseMetaString?.(attrs, code, lang) || {}
    const codeOptions: CodeToHastOptions = {
      ...options,
      lang,
      meta: {
        ...options.meta,
        ...meta,
        __raw: attrs,
      },
    }

    const builtInTransformer: ShikiTransformer[] = []

    builtInTransformer.push({
      name: '@shikijs/markdown-it:block-class',
      code(node) {
        node.properties.class = `language-${lang}`
      },
    })

    return highlighter.codeToHtml(
      code.slice(0, -1),
      {
        ...codeOptions,
        transformers: [
          ...builtInTransformer,
          ...codeOptions.transformers || [],
        ],
      },
    )
  }
}

export function fromHighlighter(
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownItShikiSetupOptions,
) {
  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options)
  }
}
