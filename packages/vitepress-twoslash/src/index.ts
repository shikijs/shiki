/* eslint-disable node/prefer-global/process */
import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import type { ShikiTransformer } from 'shiki'
import type { VueSpecificOptions } from 'twoslash-vue'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createTransformerFactory } from '@shikijs/twoslash/core'
import { removeTwoslashNotations, type TwoslashExecuteOptions, type TwoslashReturn } from 'twoslash'
import { createTwoslasher } from 'twoslash-vue'
import { rendererFloatingVue } from './renderer-floating-vue'

export * from './renderer-floating-vue'

export function createFileSystemTypesCache(options: {
  dir: string
}): TypesCache {
  return {
    read(hash) {
      const filePath = join(options.dir, `${hash}.json`)
      if (!existsSync(filePath)) {
        return null
      }
      return JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }))
    },
    write(hash, data) {
      const filePath = join(options.dir, `${hash}.json`)
      const json = JSON.stringify(data)

      writeFileSync(filePath, json, { encoding: 'utf-8' })
    },
    preprocess() {
      try {
        mkdirSync(options.dir)
      }
      catch {} // Dir has already existed
    },
  }
}

export interface TypesCache {
  /**
   * Read hash JSON
   * @param hash Code hash
   */
  read: (hash: string) => TwoslashReturn | null

  /**
   * Write cache JSON
   * @param hash Code hash
   * @param data Twoslash data
   */
  write: (hash: string, data: TwoslashReturn) => void

  /**
   * This function is called when transformerTwoslash initialized.
   */
  preprocess?: () => void
}

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
   * The options for caching types
   * @default false
   * @example
   * ```ts
   * import { transformerTwoslash, createFileSystemTypesCache } from '@shikijs/vitepress-twoslash'
   * transformerTwoslash({
   *   typesCache: createFileSystemTypesCache({
   *     dir: './my-cache-dir'
   *   })
   * })
   * ```
   */
  typesCache?: TypesCache | false
}

/**
 * Create a Shiki transformer for VitePress to enable twoslash integration
 *
 * Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
 */
export function transformerTwoslash(options: VitePressPluginTwoslashOptions = {}): ShikiTransformer {
  const {
    explicitTrigger = true,
    typesCache = false,
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
  const twoslasherWithCache = (code: string, extension?: string, options?: TwoslashExecuteOptions): TwoslashReturn => {
    if (!typesCache) {
      // This function is called if typesCache is not false.
      throw new TypeError('Unreachable error')
    }
    const hash = createHash('SHA256').update(code).digest('hex')

    const cachedTwoslashResult = typesCache.read(hash) // Restore cache
    if (cachedTwoslashResult) {
      return cachedTwoslashResult
    }

    const twoslashResult = defaultTwoslasher(code, extension, options)
    typesCache.write(hash, twoslashResult)

    return twoslashResult
  }
  twoslasherWithCache.getCacheMap = defaultTwoslasher.getCacheMap

  const twoslash = createTransformerFactory(
    typesCache ? twoslasherWithCache : defaultTwoslasher,
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

  typesCache && typesCache.preprocess?.()

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
