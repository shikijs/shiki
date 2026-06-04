import type { ShikiTransformer, TransformerOptions } from '@shikijs/types'
import { transformerDecorations } from '../transformer-decorations'

const builtInTransformers: ShikiTransformer[] = [
  /* @__PURE__ */ transformerDecorations(),
]

/**
 * A view onto the sorted+filtered transformer list used by the HAST builder.
 *
 * Pre-filtered into per-hook arrays so the (hot) per-token loop only iterates
 * transformers that actually implement that hook.
 */
export interface TransformersView {
  /** Full ordered list (pre → normal → post → builtIns). */
  all: ShikiTransformer[]
  preprocess: ShikiTransformer[]
  tokens: ShikiTransformer[]
  span: ShikiTransformer[]
  line: ShikiTransformer[]
  code: ShikiTransformer[]
  pre: ShikiTransformer[]
  root: ShikiTransformer[]
}

export function getTransformers(options: TransformerOptions): ShikiTransformer[] {
  return resolveTransformers(options).all
}

export function resolveTransformers(options: TransformerOptions): TransformersView {
  const sorted = sortTransformersByEnforcement(options.transformers || [])
  const all = [
    ...sorted.pre,
    ...sorted.normal,
    ...sorted.post,
    ...builtInTransformers,
  ]

  const view: TransformersView = {
    all,
    preprocess: [],
    tokens: [],
    span: [],
    line: [],
    code: [],
    pre: [],
    root: [],
  }

  // Single-pass pre-filter per hook so each call site iterates only the
  // transformers that actually implement that hook. Particularly important
  // for `span` which runs once per token.
  for (const t of all) {
    if (t.preprocess)
      view.preprocess.push(t)
    if (t.tokens)
      view.tokens.push(t)
    if (t.span)
      view.span.push(t)
    if (t.line)
      view.line.push(t)
    if (t.code)
      view.code.push(t)
    if (t.pre)
      view.pre.push(t)
    if (t.root)
      view.root.push(t)
  }

  return view
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
