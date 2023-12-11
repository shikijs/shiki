import type { TwoSlashOptions, TwoSlashReturn } from '@typescript/twoslash'
import type { CodeToHastOptions } from 'shikiji'
import type { Element, ElementContent, Text } from 'hast'

declare module 'shikiji' {
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
   * Mapping from language alias to language name
   */
  langAlias?: Record<string, string>
  /**
   * Custom filter function to apply this transformer to
   * When specified, `langs` will be ignored
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
}

export interface TwoSlashRenderers {
  lineError(error: TwoSlashReturn['errors'][0]): ElementContent[]
  lineCompletions(query: TwoSlashReturn['queries'][0]): ElementContent[]
  lineQuery(query: TwoSlashReturn['queries'][0], targetNode?: Element | Text): ElementContent[]
  lineCustomTag(tag: TwoSlashReturn['tags'][0]): ElementContent[]

  nodeError(error: TwoSlashReturn['errors'][0], node: Element | Text): ElementContent
  nodeStaticInfo(info: TwoSlashReturn['staticQuickInfos'][0], node: Element | Text): ElementContent
}
