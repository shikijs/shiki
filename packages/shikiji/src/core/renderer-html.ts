import { toHtml as hastToHtml } from 'hast-util-to-html'
import type { CodeToHastOptions, ShikiContext } from '../types'
import { codeToHast } from './renderer-hast'

/**
 * Get highlighted code in HTML.
 */
export function codeToHtml(
  context: ShikiContext,
  code: string,
  options: CodeToHastOptions,
): string {
  let intput = code
  for (const transformer of options.transformers || [])
    intput = transformer.preprocess?.(intput, options) || intput

  let result = hastToHtml(codeToHast(context, intput, options))

  for (const transformer of options.transformers || [])
    result = transformer.postprocess?.(result, options) || result

  return result
}
