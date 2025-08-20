import type { Element, Root } from 'hast'
import type { CodeToHastOptions } from './options'
import type { CodeToTokensOptions, ThemedToken, TokensResult } from './tokens'

export interface TransformerOptions {
  /**
   * Transformers for the Shiki pipeline.
   */
  transformers?: ShikiTransformer[]
}

export interface ShikiTransformerContextMeta { }

/**
 * Common transformer context for all transformers hooks
 */
export interface ShikiTransformerContextCommon {
  meta: ShikiTransformerContextMeta
  options: CodeToHastOptions
  codeToHast: (code: string, options: CodeToHastOptions) => Root
  codeToTokens: (code: string, options: CodeToTokensOptions) => TokensResult
}

export interface ShikiTransformerContextSource extends ShikiTransformerContextCommon {
  readonly source: string
}

/**
 * Transformer context for HAST related hooks
 */
export interface ShikiTransformerContext extends ShikiTransformerContextSource {
  readonly tokens: ThemedToken[][]
  readonly root: Root
  readonly pre: Element
  readonly code: Element
  readonly lines: Element[]

  readonly structure: CodeToHastOptions['structure']

  /**
   * Utility to append class to a hast node
   *
   * If the `property.class` is a string, it will be splitted by space and converted to an array.
   */
  addClassToHast: (hast: Element, className: string | string[]) => Element
}

export interface ShikiTransformer {
  /**
   * Name of the transformer
   */
  name?: string
  /**
   * Enforce plugin invocation tier similar to webpack loaders. Hooks ordering
   * is still subject to the `order` property in the hook object.
   *
   * Plugin invocation order:
   * - `enforce: 'pre'` plugins
   * - normal plugins
   * - `enforce: 'post'` plugins
   * - shiki post plugins
   */
  enforce?: 'pre' | 'post'
  /**
   * Transform the raw input code before passing to the highlighter.
   */
  preprocess?: (this: ShikiTransformerContextCommon, code: string, options: CodeToHastOptions) => string | void
  /**
   * Transform the full tokens list before converting to HAST.
   * Return a new tokens list will replace the original one.
   */
  tokens?: (this: ShikiTransformerContextSource, tokens: ThemedToken[][]) => ThemedToken[][] | void
  /**
   * Transform the entire generated HAST tree. Return a new Node will replace the original one.
   */
  root?: (this: ShikiTransformerContext, hast: Root) => Root | void
  /**
   * Transform the `<pre>` element. Return a new Node will replace the original one.
   */
  pre?: (this: ShikiTransformerContext, hast: Element) => Element | void
  /**
   * Transform the `<code>` element. Return a new Node will replace the original one.
   */
  code?: (this: ShikiTransformerContext, hast: Element) => Element | void
  /**
   * Transform each line `<span class="line">` element.
   *
   * @param hast
   * @param line 1-based line number
   */
  line?: (this: ShikiTransformerContext, hast: Element, line: number) => Element | void
  /**
   * Transform each token `<span>` element.
   */
  span?: (this: ShikiTransformerContext, hast: Element, line: number, col: number, lineElement: Element, token: ThemedToken) => Element | void
  /**
   * Transform the generated HTML string before returning.
   * This hook will only be called with `codeToHtml`.
   */
  postprocess?: (this: ShikiTransformerContextCommon, html: string, options: CodeToHastOptions) => string | void
}
