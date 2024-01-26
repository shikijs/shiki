import type { NodeCompletion, NodeError, NodeHighlight, NodeHover, NodeQuery, NodeTag, TwoslashOptions, TwoslashReturn, twoslasher } from 'twoslash'
import type { CodeToHastOptions, ShikiTransformerContext } from '@shikijs/core'
import type { Element, ElementContent, Text } from 'hast'

declare module '@shikijs/core' {
  interface ShikiTransformerContextMeta {
    twoslash?: TwoslashReturn
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
  explicitTrigger?: boolean
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
  twoslasher?: typeof twoslasher
  /**
   * Options to pass to twoslash
   */
  twoslashOptions?: TwoslashOptions
  /**
   * Custom renderers to decide how each info should be rendered
   */
  renderer?: TwoslashRenderer
  /**
   * Strictly throw when there is an error
   * @default true
   */
  throws?: boolean
}

export interface TwoslashRenderer {
  lineError?(this: ShikiTransformerContext, error: NodeError): ElementContent[]
  lineCustomTag?(this: ShikiTransformerContext, tag: NodeTag): ElementContent[]
  lineQuery?(this: ShikiTransformerContext, query: NodeQuery, targetNode?: Element | Text): ElementContent[]
  lineCompletion?(this: ShikiTransformerContext, query: NodeCompletion): ElementContent[]

  nodeStaticInfo(this: ShikiTransformerContext, info: NodeHover, node: Element | Text): Partial<ElementContent>
  nodeError?(this: ShikiTransformerContext, error: NodeError, node: Element | Text): Partial<ElementContent>
  nodeQuery?(this: ShikiTransformerContext, query: NodeQuery, node: Element | Text): Partial<ElementContent>
  nodeCompletion?(this: ShikiTransformerContext, query: NodeCompletion, node: Element | Text): Partial<ElementContent>

  nodesHighlight?(this: ShikiTransformerContext, highlight: NodeHighlight, nodes: ElementContent[]): ElementContent[]
}
