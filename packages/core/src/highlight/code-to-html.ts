import type {
  CodeToHastOptions,
  ShikiInternal,
  ShikiTransformerContextCommon,
} from '@shikijs/types'

import { toHtml } from 'hast-util-to-html'

import { getTransformers } from './_get-transformers'
import { codeToHast } from './code-to-hast'
import { codeToTokens } from './code-to-tokens'

export const hastToHtml = toHtml

/**
 * Get highlighted code in HTML.
 */
export function codeToHtml(
  internal: ShikiInternal,
  code: string,
  options: CodeToHastOptions,
): string {
  const context: ShikiTransformerContextCommon = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
    codeToTokens: (_code, _options) => codeToTokens(internal, _code, _options),
  }

  let result = hastToHtml(codeToHast(internal, code, options, context))

  for (const transformer of getTransformers(options))
    result = transformer.postprocess?.call(context, result, options) || result

  return result
}
