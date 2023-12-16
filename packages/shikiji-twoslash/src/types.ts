import type { TwoSlashOptions, TwoSlashReturn } from '@typescript/twoslash'
import type { CodeToHastOptions, ShikijiTransformerContext } from 'shikiji-core'
import type { Element, ElementContent, Text } from 'hast'

declare module 'shikiji-core' {
  interface ShikijiTransformerContextMeta {
    twoslash?: TwoSlashReturn
  }
}

export interface TransformerTwoSlashOptions {
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
   * Options to pass to twoslash
   */
  twoslashOptions?: TwoSlashOptions
  /**
   * Custom renderers to decide how each info should be rendered
   */
  renderer?: TwoSlashRenderers
  /**
   * Strictly throw when there is an error
   * @default true
   */
  throws?: boolean
}

export interface TwoSlashRenderers {
  lineError?(this: ShikijiTransformerContext, error: TwoSlashReturn['errors'][0]): ElementContent[]
  lineCustomTag?(this: ShikijiTransformerContext, tag: TwoSlashReturn['tags'][0]): ElementContent[]
  lineQuery?(this: ShikijiTransformerContext, query: TwoSlashReturn['queries'][0], targetNode?: Element | Text): ElementContent[]
  lineCompletions?(this: ShikijiTransformerContext, query: TwoSlashReturn['queries'][0]): ElementContent[]

  nodeError?(this: ShikijiTransformerContext, error: TwoSlashReturn['errors'][0], node: Element | Text): Partial<ElementContent>
  nodeStaticInfo(this: ShikijiTransformerContext, info: TwoSlashReturn['staticQuickInfos'][0], node: Element | Text): Partial<ElementContent>
  nodeQuery?(this: ShikijiTransformerContext, query: TwoSlashReturn['queries'][0], node: Element | Text): Partial<ElementContent>
  nodeCompletions?(this: ShikijiTransformerContext, query: TwoSlashReturn['queries'][0], node: Element | Text): Partial<ElementContent>
}
