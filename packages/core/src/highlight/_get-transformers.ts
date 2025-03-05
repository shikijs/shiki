import type { AsyncTransformerOptions, ShikiAsyncTransformer, ShikiTransformer, TransformerOptions } from '@shikijs/types'
import { transformerDecorations } from '../transformer-decorations'

const builtInTransformers: ShikiTransformer[] = [
  /* @__PURE__ */ transformerDecorations(),
]

export function getTransformers(options: TransformerOptions): ShikiTransformer[] {
  return [
    ...options.transformers || [],
    ...builtInTransformers,
  ]
}

export function getAsyncTransformers(options: AsyncTransformerOptions): ShikiAsyncTransformer[] {
  return [
    ...options.transformers || [],
    ...builtInTransformers,
  ]
}
