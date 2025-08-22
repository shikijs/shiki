import type { ShikiTransformer } from 'shiki'
import type { Plugin } from 'vite'
import type { UserConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { createFenceSourceMap } from './fence-source-map'
import { resolveMarkdownItSourceMaps } from './markdown-it-source-map'

export function withFenceSourceMap(config: UserConfig): UserConfig {
  const { inject: injectFenceSourceMap, extract: extractFenceSourceMap } = createFenceSourceMap()

  // inject source map to all fences on load
  const InjectPlugin: Plugin = {
    name: 'vitepress-twoslash:inject-fence-source-map',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        const sourceMaps = resolveMarkdownItSourceMaps(code, id)
        return injectFenceSourceMap(code, sourceMaps)
      }
    },
  }

  // extract and remove source map from fence
  const transformer: ShikiTransformer = {
    name: 'vitepress-twoslash:extract-fence-source-map',
    enforce: 'pre',
    preprocess(code) {
      const { code: transformedCode, sourceMap } = extractFenceSourceMap(code)
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
