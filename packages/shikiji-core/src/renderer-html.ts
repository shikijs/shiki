import { toHtml as hastToHtml } from 'hast-util-to-html'
import type { CodeToHastOptions, ShikiInternal, ShikijiTransformerContextCommon } from './types'
import { codeToHast } from './renderer-hast'

/**
 * Get highlighted code in HTML.
 */
export function codeToHtml(
  internal: ShikiInternal,
  code: string,
  options: CodeToHastOptions,
): string {
  const context: ShikijiTransformerContextCommon = {
    meta: {},
    codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
  }

  let intput = code
  for (const transformer of options.transformers || [])
    intput = transformer.preprocess?.call(context, intput, options) || intput

  let result = hastToHtml(codeToHast(internal, intput, options, context))

  for (const transformer of options.transformers || [])
    result = transformer.postprocess?.call(context, result, options) || result

  return result
}
