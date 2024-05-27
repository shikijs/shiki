/* eslint-disable node/prefer-global/process */
import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import { createTransformerFactory } from '@shikijs/twoslash/core'
import type { VueSpecificOptions } from 'twoslash-vue'
import { createTwoslasher } from 'twoslash-vue'
import type { ShikiTransformer } from 'shiki'
import { removeTwoslashNotations } from 'twoslash'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue'
import { rendererFloatingVue } from './renderer-floating-vue'

export * from './renderer-floating-vue'

interface TransformerTwoslashVueOptions extends TransformerTwoslashOptions {
  twoslashOptions?: TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions
}

export interface VitePressPluginTwoslashOptions extends TransformerTwoslashVueOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: TransformerTwoslashOptions['explicitTrigger']
}

/**
 * Create a Shiki transformer for VitePress to enable twoslash integration
 *
 * Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
 */
export function transformerTwoslash(options: VitePressPluginTwoslashOptions = {}): ShikiTransformer {
  const {
    explicitTrigger = true,
  } = options

  const onError = (error: any, code: string) => {
    const isCI = typeof process !== 'undefined' && process?.env?.CI
    const isDev = typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development'
    const shouldThrow = (options.throws || isCI || !isDev) && options.throws !== false
    console.error(`\n\n--------\nTwoslash error in code:\n--------\n${code.split(/\n/g).slice(0, 15).join('\n').trim()}\n--------\n`)
    if (shouldThrow)
      throw error
    else
      console.error(error)
    return removeTwoslashNotations(code)
  }

  const twoslash = createTransformerFactory(
    createTwoslasher(options.twoslashOptions),
  )({
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
