import type { TwoslashTypesCache } from '@shikijs/twoslash'
import type { ShikiTransformer } from 'shiki'
import type { Plugin } from 'vite'
import type { UserConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { createInlineTypesCache } from './cache-inline'
import { createFenceSourceMap } from './fence-source-map'

export function createTwoslashConfig(): {
  withTwoslash: (config: UserConfig) => UserConfig
  twoslashCache: TwoslashTypesCache
} {
  const { inject: injectFenceSourceMap, extract: extractFenceSourceMap } = createFenceSourceMap()

  // inject source map to all fences on load
  const pre: Plugin = {
    name: 'vitepress-twoslash:fence-source',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        return injectFenceSourceMap(code, id)
      }
    },
  }

  // extract and remove source map from fence
  const transformerFenceInfo: ShikiTransformer = {
    name: '@shikijs/vitepress-twoslash-fence',
    preprocess(code) {
      const { code: transformedCode, sourceMap } = extractFenceSourceMap(code)
      this.meta.sourceMap = sourceMap
      return transformedCode
    },
  }

  // provide twoslash cache reader and writer
  const { twoslashCache, patcher } = createInlineTypesCache()

  // patch magic files changes after transform
  const post: Plugin = {
    name: 'vitepress-twoslash:patch',
    enforce: 'post',
    transform(code, id) {
      if (id.endsWith('.md')) {
        patcher.patch(id)
      }
    },
  }

  function withTwoslash(config: UserConfig): UserConfig {
    // config markdown code transformers
    const codeTransformers = (config.markdown ??= {}).codeTransformers ??= []
    codeTransformers.unshift(transformerFenceInfo)

    // config vite plugins
    const plugins = (config.vite ??= {}).plugins ??= []
    plugins.push(pre, post)

    return config
  }

  return {
    withTwoslash,
    twoslashCache,
  }
}
