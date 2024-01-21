import { toHtml as hastToHtml } from 'hast-util-to-html'
import type { CodeToHastOptions, ShikiInternal, ShikijiTransformerContextCommon } from './types'
import { codeToHast } from './code-to-hast'

export { hastToHtml }

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
    options,
    codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
  }

  let result = hastToHtml(codeToHast(internal, code, options, context))

  for (const transformer of options.transformers || [])
    result = transformer.postprocess?.call(context, result, options) || result

  return result
}
