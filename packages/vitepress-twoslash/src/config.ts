import type { TwoslashTypesCache } from '@shikijs/twoslash'
import type { ShikiTransformer } from 'shiki'
import type { Plugin } from 'vite'
import type { UserConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { createTwoslashMdCache, FilePatcher } from './cache-md'
import { resolveFenceSource, transformFenceSource } from './fence-source'

export function createTwoslashConfig(): {
  withTwoslash: (config: UserConfig) => UserConfig
  twoslashCache: TwoslashTypesCache
} {
  // inject info to all fences in markdown file on load
  const pre: Plugin = {
    name: 'vitepress-twoslash:fence-source',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        return transformFenceSource(code, id)
      }
    },
  }

  // extract source info from fence
  const transformerFenceInfo: ShikiTransformer = {
    name: '@shikijs/vitepress-twoslash-fence',
    preprocess(code) {
      const info = resolveFenceSource(code)
      this.meta.source = info.source
      return info.code
    },
  }

  // provide twoslash cache reader and writer
  const patcher = new FilePatcher()

  const twoslashCache = createTwoslashMdCache(patcher)

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
