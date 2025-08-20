import type { Plugin } from 'vite'
import type { UserConfig } from 'vitepress'
import type { VitePressPluginTwoslashOptions } from '../types'
import { transformerTwoslash } from '..'
import { createInlineTypesCache } from './cache-inline'
import { isEnabledEnv } from './env'
import { withFenceSourceMap } from './fence-source-map'

export function createTwoslashWithInlineCache(options: VitePressPluginTwoslashOptions = {}): (config: UserConfig) => UserConfig {
  return function (config: UserConfig): UserConfig {
    if (isEnabledEnv('TWOSLASH_INLINE_CACHE') === false)
      return config

    // provide twoslash cache reader and writer
    const { typesCache, patcher } = createInlineTypesCache({
      remove: isEnabledEnv('TWOSLASH_INLINE_CACHE_REMOVE') === true,
      ignoreCache: isEnabledEnv('TWOSLASH_INLINE_CACHE_IGNORE') === true,
    })

    const transformer = transformerTwoslash({ ...options, typesCache })

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
    config = withFenceSourceMap(config)

    // config markdown code transformers
    const codeTransformers = (config.markdown ??= {}).codeTransformers ??= []
    codeTransformers.push(transformer)

    // config vite plugins
    const plugins = (config.vite ??= {}).plugins ??= []
    plugins.push(PatchPlugin)

    return config
  }
}
