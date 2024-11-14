import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import type { TwoslashReturn } from 'twoslash'
import type { VueSpecificOptions } from 'twoslash-vue'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue'

interface TransformerTwoslashVueOptions extends TransformerTwoslashOptions {
  twoslashOptions?: TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions
}

export interface VitePressPluginTwoslashOptions extends TransformerTwoslashVueOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: TransformerTwoslashOptions['explicitTrigger']

  /**
   * The options for caching resolved types
   *
   * @example
   * ```ts
   * import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
   * import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
   *
   * transformerTwoslash({
   *   typesCache: createFileSystemTypesCache({
   *     dir: './my-cache-dir'
   *   })
   * })
   * ```
   */
  typesCache?: TwoslashTypesCache
}

export interface TwoslashTypesCache {
  /**
   * Read cached result
   *
   * @param code Source code
   */
  read: (code: string) => TwoslashReturn | null

  /**
   * Save result to cache
   *
   * @param code Source code
   * @param data Twoslash data
   */
  write: (code: string, data: TwoslashReturn) => void

  /**
   * On initialization
   */
  init?: () => void
}
