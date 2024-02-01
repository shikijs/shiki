import { transformerDecorations } from './transformer-decorations'
import type { TransformerOptions } from './types'

const builtInTransformers = /* @__PURE__ */ [
  /* @__PURE__ */ transformerDecorations(),
]

export function getTransformers(options: TransformerOptions) {
  return [
    ...options.transformers || [],
    ...builtInTransformers,
  ]
}
