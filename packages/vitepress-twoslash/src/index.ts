/* eslint-disable node/prefer-global/process */
import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import { ShikiTwoslashError, createTransformerFactory } from '@shikijs/twoslash/core'
import { createTwoslasher } from 'twoslash-vue'
import type { ShikiTransformer } from 'shiki'
import { removeTwoslashNotations } from 'twoslash'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue'
import { rendererFloatingVue } from './renderer-floating-vue'

export * from './renderer-floating-vue'

export interface VitePressPluginTwoslashOptions extends TransformerTwoslashOptions, TwoslashFloatingVueRendererOptions {
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

  const twoslash = createTransformerFactory(
    createTwoslasher(),
  )({
    langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
    renderer: rendererFloatingVue(options),
    onTwoslashError: (error, code) => {
      const isCI = typeof process !== 'undefined' && process?.env?.CI
      const isDev = typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development'
      console.error(String(error), `\n\n--------\nTwoslash error in code:\n--------\n${code.split(/\n/g).slice(0, 15).join('\n').trim()}\n--------\n`)
      if (isCI || !isDev || options.throws)
        throw error
      if (typeof process !== 'undefined')
        process.exitCode = 1
      return removeTwoslashNotations(code)
    },
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
        return html.replace(/{/g, '&#123;')
    },
  }
}
