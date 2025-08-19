import type { ShikiTransformer, TransformerOptions } from '@shikijs/types'
import { transformerDecorations } from '../transformer-decorations'

const builtInTransformers: ShikiTransformer[] = [
  /* @__PURE__ */ transformerDecorations(),
]

export function getTransformers(options: TransformerOptions): ShikiTransformer[] {
  const transformers = sortTransformersByEnforcement(options.transformers || [])
  return [
    ...transformers.pre,
    ...transformers.normal,
    ...transformers.post,
    ...builtInTransformers,
  ]
}

function sortTransformersByEnforcement(transformers: ShikiTransformer[]): {
  pre: ShikiTransformer[]
  post: ShikiTransformer[]
  normal: ShikiTransformer[]
} {
  const pre: ShikiTransformer[] = []
  const post: ShikiTransformer[] = []
  const normal: ShikiTransformer[] = []

  for (const transformer of transformers) {
    switch (transformer.enforce) {
      case 'pre':
        pre.push(transformer)
        break
      case 'post':
        post.push(transformer)
        break
      default:
        normal.push(transformer)
    }
  }

  return { pre, post, normal }
}
