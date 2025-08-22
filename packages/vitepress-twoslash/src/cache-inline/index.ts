import type { ShikiTransformer } from 'shiki'
import type { Plugin } from 'vite'
import type { UserConfig } from 'vitepress'
import type { VitePressPluginTwoslashOptions } from '../types'
import type { MarkdownFencesLocator, MarkdownFenceSourceMap } from './markdown-fence'
import { readFileSync } from 'node:fs'
import { transformerTwoslash } from '..'
import { createInlineTypesCache } from './cache-inline'
import { isEnabledEnv } from './env'
import { markdownItLocator } from './locator-markdown-it'
import { createMarkdownFenceSourceCodec } from './markdown-fence'

export interface TwoslashInlineCacheOptions {
  mdFencesLocator?: MarkdownFencesLocator
}

export function createTwoslashWithInlineCache(
  twoslashOptions: VitePressPluginTwoslashOptions = {},
  {
    mdFencesLocator = markdownItLocator,
  }: TwoslashInlineCacheOptions = {},
): (config: UserConfig) => UserConfig {
  return function (config: UserConfig): UserConfig {
    if (isEnabledEnv('TWOSLASH_INLINE_CACHE') === false)
      return config

    // provide twoslash cache reader and writer
    const { typesCache, patcher } = createInlineTypesCache({
      remove: isEnabledEnv('TWOSLASH_INLINE_CACHE_REMOVE') === true,
      ignoreCache: isEnabledEnv('TWOSLASH_INLINE_CACHE_IGNORE') === true,
    })

    const transformer = transformerTwoslash({ ...twoslashOptions, typesCache })

    // patch magic files changes after transform
    const PatchPlugin: Plugin = {
      name: 'vitepress-twoslash:patch',
      enforce: 'post',
      transform(code, id) {
        if (id.endsWith('.md')) {
          patcher.patch(id)
        }
      },
    }

    // add source map to markdown fence
    config = withFenceSourceMap(config, mdFencesLocator)

    // config markdown code transformers
    const codeTransformers = (config.markdown ??= {}).codeTransformers ??= []
    codeTransformers.push(transformer)

    // config vite plugins
    const plugins = (config.vite ??= {}).plugins ??= []
    plugins.push(PatchPlugin)

    return config
  }
}

function withFenceSourceMap(config: UserConfig, locator: MarkdownFencesLocator): UserConfig {
  const codec = createMarkdownFenceSourceCodec()

  // inject source map to all fences on load
  const InjectPlugin: Plugin = {
    name: 'vitepress-twoslash:inject-fence-source-map',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        const ranges = locator(code)
        const injects = new Map<number, MarkdownFenceSourceMap>()
        for (const range of ranges)
          injects.set(range.from, { ...range, path: id })

        return {
          code: codec.injectToMarkdown(code, injects),
        }
      }
    },
  }

  // extract and remove source map from fence
  const transformer: ShikiTransformer = {
    name: 'vitepress-twoslash:extract-fence-source-map',
    enforce: 'pre',
    preprocess(code) {
      const { code: transformedCode, sourceMap } = codec.extractFromFence(code)
      this.meta.sourceMap = sourceMap
      return transformedCode
    },
  }

  // config markdown code transformers
  const codeTransformers = (config.markdown ??= {}).codeTransformers ??= []
  codeTransformers.unshift(transformer)

  // config vite plugins
  const plugins = (config.vite ??= {}).plugins ??= []
  plugins.push(InjectPlugin)

  return config
}
