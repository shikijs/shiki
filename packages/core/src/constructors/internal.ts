import type { HighlighterCoreOptions, ShikiInternal } from '@shikijs/types'
import { resolveLangs, resolveThemes } from '../textmate/getters-resolve'
import { warnDeprecated } from '../warn'
import { createShikiInternalSync } from './internal-sync'

/**
 * Get the minimal shiki context for rendering.
 */
export async function createShikiInternal(options: HighlighterCoreOptions): Promise<ShikiInternal> {
  if (!options.engine) {
    warnDeprecated('`engine` option is required. Use `createOnigurumaEngine` or `createJavaScriptRegexEngine` to create an engine.')
  }

  const [
    themes,
    langs,
    engine,
  ] = await Promise.all([
    resolveThemes(options.themes || []),
    resolveLangs(options.langs || []),
    options.engine,
  ] as const)

  return createShikiInternalSync({
    ...options,
    themes,
    langs,
    engine,
  })
}
