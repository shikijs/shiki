import type { CodeToHastOptions, ShikiTransformerContext } from '@shikijs/types'
import type { Element, ElementContent, Text } from 'hast'
import type {
  NodeCompletion,
  NodeError,
  NodeHighlight,
  NodeHover,
  NodeQuery,
  NodeTag,
  TwoslashExecuteOptions,
  TwoslashGenericFunction,
  TwoslashOptions,
  TwoslashReturn,
} from 'twoslash'

// We only pick necessary types to Shiki, making passing custom twoslash implementation easier
export type TwoslashShikiReturn =
  Pick<TwoslashReturn, 'nodes' | 'code'> & {
    meta?: Partial<Pick<TwoslashReturn['meta'], 'extension'>>
  }

export type TwoslashShikiFunction = (code: string, lang?: string, options?: TwoslashExecuteOptions) => TwoslashShikiReturn

declare module '@shikijs/core' {
  interface ShikiTransformerContextMeta {
    twoslash?: TwoslashShikiReturn
  }
}

export interface TransformerTwoslashOptions {
  /**
   * Languages to apply this transformer to
   */
  langs?: string[]
  /**
   * Requires `twoslash` to be presented in the code block meta to apply this transformer
   *
   * @default false
   */
  explicitTrigger?: boolean | RegExp
  /**
   * Mapping from language alias to language name
   */
  langAlias?: Record<string, string>
  /**
   * Custom filter function to apply this transformer to
   * When specified, `langs` and `explicitTrigger` will be ignored
   */
  filter?: (lang: string, code: string, options: CodeToHastOptions) => boolean
  /**
   * Custom instance of twoslasher function
   */
  twoslasher?: TwoslashShikiFunction | TwoslashGenericFunction
  /**
   * Options to pass to twoslash
   */
  twoslashOptions?: TwoslashOptions
  /**
   * Custom renderers to decide how each info should be rendered
   */
  renderer?: TwoslashRenderer
  /**
   * A map to store code for `@include` directive
   * Provide your own instance if you want to clear the map between each transformation
   */
  includesMap?: Map<string, string>
  /**
   * Strictly throw when there is an error
   * @default true
   */
  throws?: boolean
  /**
   * Custom error handler for twoslash errors
   * When specified, `throws` will be ignored
   * Optionally return a string to replace the code
   */
  onTwoslashError?: (error: unknown, code: string, lang: string, options: CodeToHastOptions) => string | void
  /**
   * Custom error handler for Shiki errors
   * When specified, `throws` will be ignored
   */
  onShikiError?: (error: unknown, code: string, lang: string) => void
}

export interface TwoslashRenderer {
  lineError?: (this: ShikiTransformerContext, error: NodeError) => ElementContent[]
  lineCustomTag?: (this: ShikiTransformerContext, tag: NodeTag) => ElementContent[]
  lineQuery?: (this: ShikiTransformerContext, query: NodeQuery, targetNode?: Element | Text) => ElementContent[]
  lineCompletion?: (this: ShikiTransformerContext, query: NodeCompletion) => ElementContent[]

  nodeStaticInfo: (this: ShikiTransformerContext, info: NodeHover, node: Element | Text) => Partial<ElementContent>
  nodeError?: (this: ShikiTransformerContext, error: NodeError, node: Element | Text) => Partial<ElementContent>
  nodeQuery?: (this: ShikiTransformerContext, query: NodeQuery, node: Element | Text) => Partial<ElementContent>
  nodeCompletion?: (this: ShikiTransformerContext, query: NodeCompletion, node: Element | Text) => Partial<ElementContent>

  nodesError?: (this: ShikiTransformerContext, error: NodeError, nodes: ElementContent[]) => ElementContent[]
  nodesHighlight?: (this: ShikiTransformerContext, highlight: NodeHighlight, nodes: ElementContent[]) => ElementContent[]
}
