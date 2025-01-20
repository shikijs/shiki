/* eslint-disable node/prefer-global/process */
import type { ShikiTransformer } from 'shiki'
import type { TwoslashExecuteOptions, TwoslashReturn } from 'twoslash'
import type { VitePressPluginTwoslashOptions } from './types'
import { createTransformerFactory } from '@shikijs/twoslash/core'
import { removeTwoslashNotations } from 'twoslash'
import { createTwoslasher } from 'twoslash-vue'
import { rendererFloatingVue } from './renderer-floating-vue'

export * from './renderer-floating-vue'
export * from './types'

/**
 * Create a Shiki transformer for VitePress to enable twoslash integration
 *
 * Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
 */
export function transformerTwoslash(options: VitePressPluginTwoslashOptions = {}): ShikiTransformer {
  const {
    explicitTrigger = true,
    typesCache,
  } = options

  const onError = (error: any, code: string): void => {
    const isCI = typeof process !== 'undefined' && process?.env?.CI
    const isDev = typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development'
    const shouldThrow = (options.throws || isCI || !isDev) && options.throws !== false
    console.error(`\n\n--------\nTwoslash error in code:\n--------\n${code.split(/\n/g).slice(0, 15).join('\n').trim()}\n--------\n`)
    if (shouldThrow)
      throw error
    else
      console.error(error)
    removeTwoslashNotations(code)
  }

  const defaultTwoslasher = createTwoslasher(options.twoslashOptions)

  let twoslasher = defaultTwoslasher
  // Wrap twoslasher with cache when `resultCache` is provided
  if (typesCache) {
    twoslasher = ((code: string, extension?: string, options?: TwoslashExecuteOptions): TwoslashReturn => {
      const cached = typesCache.read(code) // Restore cache
      if (cached)
        return cached

      const twoslashResult = defaultTwoslasher(code, extension, options)
      typesCache.write(code, twoslashResult)
      return twoslashResult
    }) as typeof defaultTwoslasher
    twoslasher.getCacheMap = defaultTwoslasher.getCacheMap
  }

  const twoslash = createTransformerFactory(twoslasher)({
    langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
    renderer: rendererFloatingVue(options),
    onTwoslashError: onError,
    onShikiError: onError,
    ...options,
    explicitTrigger,
  })

  const trigger = explicitTrigger instanceof RegExp
    ? explicitTrigger
    : /\btwoslash\b/

  typesCache?.init?.()

  return {
    ...twoslash,
    name: '@shikijs/vitepress-twoslash',
    preprocess(code, options) {
      const cleanup = options.transformers?.find(i => i.name === 'vitepress:clean-up')
      if (cleanup)
        options.transformers?.splice(options.transformers.indexOf(cleanup), 1)

      // Disable v-pre for twoslash, because we need render it with FloatingVue
      if (!explicitTrigger || options.meta?.__raw?.match(trigger)) {
        const vPre = options.transformers?.find(i => i.name === 'vitepress:v-pre')
        if (vPre)
          options.transformers?.splice(options.transformers.indexOf(vPre), 1)
      }

      return twoslash.preprocess!.call(this, code, options)
    },
    postprocess(html) {
      if (this.meta.twoslash)
        return html.replace(/\{/g, '&#123;')
    },
  }
}
