import { toHtml } from 'hast-util-to-html'
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
  return toHtml(codeToHast(context, code, options))
}
