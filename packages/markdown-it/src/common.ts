import type {
  BuiltinLanguage,
  BuiltinTheme,
  CodeOptionsMeta,
  CodeOptionsThemes,
  LanguageInput,
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

export type MarkdownItShikiSetupOptions
  = & CodeOptionsThemes<BuiltinTheme>
    & TransformerOptions
    & CodeOptionsMeta
    & MarkdownItShikiExtraOptions
