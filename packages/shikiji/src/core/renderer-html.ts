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
  return hastToHtml(codeToHast(context, code, options))
}
