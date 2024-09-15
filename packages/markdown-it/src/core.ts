import type MarkdownIt from 'markdown-it'
import type {
  BuiltinLanguage,
  BuiltinTheme,
  CodeOptionsMeta,
  CodeOptionsThemes,
  CodeToHastOptions,
  HighlighterGeneric,
  LanguageInput,
  ShikiTransformer,
  TransformerOptions,
} from 'shiki'

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

  /**
   * markdown-it's highlight function will add a trailing newline to the code.
   *
   * This integration removes the trailing newline to the code by default,
   * you can turn this off by passing false.
   *
   * @default true
   */
  trimEndingNewline?: boolean

  /**
   * When lang of code block is empty string, it will work.
   *
   * @default 'text'
   */
  defaultLanguage?: LanguageInput | BuiltinLanguage

  /**
   * When lang of code block is not included in langs of options, it will be as a fallback lang.
   */
  fallbackLanguage?: LanguageInput | BuiltinLanguage
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
): void {
  const {
    parseMetaString,
    trimEndingNewline = true,
    defaultLanguage = 'text',
    fallbackLanguage,
  } = options
  const langs = highlighter.getLoadedLanguages()
  markdownit.options.highlight = (code, lang = 'text', attrs) => {
    if (lang === '') {
      lang = defaultLanguage as string
    }
    if (fallbackLanguage && !langs.includes(lang)) {
      lang = fallbackLanguage as string
    }
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

    if (trimEndingNewline) {
      if (code.endsWith('\n'))
        code = code.slice(0, -1)
    }

    return highlighter.codeToHtml(
      code,
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
