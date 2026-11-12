/* eslint-disable node/prefer-global/process */
import type { ShikiTransformer, ShikiTransformerContextMeta } from 'shiki'
import type { VitePressPluginTwoslashOptions } from './types'
import { createTransformerFactory } from '@shikijs/twoslash/core'
import { removeTwoslashNotations } from 'twoslash'
import { createTwoslasher } from 'twoslash-vue'
import { optimizePopupContent } from './popup-optimization'
import { rendererFloatingVue } from './renderer-floating-vue'

export * from './renderer-floating-vue'
export * from './types'

const RE_NEWLINE = /\n/g
const RE_TWOSLASH = /\btwoslash\b/
const RE_LEFT_BRACE = /\{/g
const knownPreHooks = new Set(['vitepress:add-class', 'vitepress:add-dir', 'vitepress:v-pre'])

/**
 * Create a Shiki transformer for VitePress to enable twoslash integration
 *
 * Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
 */
export function transformerTwoslash(options: VitePressPluginTwoslashOptions = {}): ShikiTransformer {
  const {
    explicitTrigger = true,
  } = options

  const onError = (error: any, code: string): string | void => {
    const isCI = typeof process !== 'undefined' && process?.env?.CI
    const isDev = typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development'
    const shouldThrow = (options.throws || isCI || !isDev) && options.throws !== false
    console.error(`\n\n--------\nTwoslash error in code:\n--------\n${code.split(RE_NEWLINE).slice(0, 15).join('\n').trim()}\n--------\n`)
    if (shouldThrow)
      throw error
    else
      console.error(error)
    return removeTwoslashNotations(code)
  }

  const twoslash = createTransformerFactory(
    createTwoslasher(options.twoslashOptions),
  )({
    langs: [
      'ts',
      'tsx',
      'js',
      'jsx',
      'json',
      'vue',
    ],
    renderer: rendererFloatingVue(options),
    onTwoslashError: onError,
    onShikiError: onError,
    ...options,
    explicitTrigger,
  })

  const trigger = explicitTrigger instanceof RegExp
    ? explicitTrigger
    : RE_TWOSLASH

  const retainedVPre = new WeakSet<ShikiTransformerContextMeta>()

  function canOptimize(transformers: ShikiTransformer[] | undefined, own: ShikiTransformer): boolean {
    if (options.optimizePopups === false || options.renderer != null || !transformers)
      return false
    const ownIndex = transformers.indexOf(own)
    const vPreHooks = transformers.filter(i => i.name === 'vitepress:v-pre')
    if (ownIndex < 0 || vPreHooks.length !== 1 || transformers.indexOf(vPreHooks[0]) >= ownIndex)
      return false
    return transformers.every((item, index) => !item.pre || (
      item.enforce == null && (index >= ownIndex || knownPreHooks.has(item.name || ''))
    ))
  }

  const transformer: ShikiTransformer = {
    ...twoslash,
    name: '@shikijs/vitepress-twoslash',
    preprocess(code, options) {
      retainedVPre.delete(this.meta)
      const cleanup = options.transformers?.find(i => i.name === 'vitepress:clean-up')
      if (cleanup)
        options.transformers?.splice(options.transformers.indexOf(cleanup), 1)

      // Disable v-pre for twoslash, because we need render it with FloatingVue
      if (!explicitTrigger || options.meta?.__raw?.match(trigger)) {
        const vPre = options.transformers?.find(i => i.name === 'vitepress:v-pre')
        if (vPre) {
          if (options.structure !== 'inline' && canOptimize(options.transformers, transformer))
            retainedVPre.add(this.meta)
          else
            options.transformers?.splice(options.transformers.indexOf(vPre), 1)
        }
      }

      return twoslash.preprocess!.call(this, code, options)
    },
    pre(node) {
      node = twoslash.pre?.call(this, node) || node
      if (retainedVPre.has(this.meta)) {
        const isStatic = 'v-pre' in node.properties
        delete node.properties['v-pre']
        // In *-vue fences VitePress restores raw mustaches after highlighting.
        // Preserve their original HAST rather than embedding that text in JSON.
        if (isStatic && this.meta.twoslash && canOptimize(this.options.transformers, transformer))
          optimizePopupContent(node)
      }
      return node
    },
    root(node) {
      if (retainedVPre.has(this.meta)) {
        // Only clean up when a later preprocess moved VitePress's pre hook.
        // Otherwise a custom pre hook may have intentionally restored v-pre.
        const transformers = this.options.transformers || []
        if (transformers.findIndex(i => i.name === 'vitepress:v-pre') > transformers.indexOf(transformer)) {
          for (const child of node.children) {
            if (child.type === 'element' && child.tagName === 'pre')
              delete child.properties['v-pre']
          }
        }
        retainedVPre.delete(this.meta)
      }
      return twoslash.root?.call(this, node) || node
    },
    postprocess(html) {
      if (this.meta.twoslash)
        return html.replace(RE_LEFT_BRACE, '&#123;')
    },
  }
  return transformer
}
