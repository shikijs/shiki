import { transformerDecorations } from '../transformer-decorations'
import type { ShikiTransformer, TransformerOptions } from '../types'

const builtInTransformers: ShikiTransformer[] = [
  /* @__PURE__ */ transformerDecorations(),
]

export function getTransformers(options: TransformerOptions): ShikiTransformer[] {
  return [
    ...options.transformers || [],
    ...builtInTransformers,
  ]
}
