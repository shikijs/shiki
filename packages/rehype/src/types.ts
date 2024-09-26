import type { Element, Root } from 'hast'
import type {
  BuiltinTheme,
  CodeOptionsMeta,
  CodeOptionsThemes,
  CodeToHastOptionsCommon,
  TransformerOptions,
} from 'shiki'

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
   *
   * Ignored if `lazy` is enabled
   */
  fallbackLanguage?: string

  /**
   * Load languages and themes on-demand.
   * When enable, this would make requires the unified pipeline to be async.
   *
   * @default false
   */
  lazy?: boolean

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
    tree: Root
  ) => Record<string, any> | undefined | null

  /**
   * Highlight inline code blocks
   *
   * - `false`: disable inline code block highlighting
   * - `tailing-curly-colon`: highlight with `\`code{:lang}\``
   *
   * @see https://shiki.style/packages/rehype#inline-code
   * @default false
   */
  inline?: false | 'tailing-curly-colon'

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

export type RehypeShikiCoreOptions =
  & CodeOptionsThemes<BuiltinTheme>
  & TransformerOptions
  & CodeOptionsMeta
  & RehypeShikiExtraOptions
  & Omit<CodeToHastOptionsCommon, 'lang'>
