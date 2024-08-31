import type { ShikiTransformer, TransformerOptions } from '../types'
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
