import type {
  HighlighterCoreOptions,
  ShikiInternal,
} from '@shikijs/types'

import { resolveLangs, resolveThemes } from '../textmate/getters-resolve'
import { createShikiInternalSync } from './internal-sync'

/**
 * Get the minimal shiki context for rendering.
 */
export async function createShikiInternal(options: HighlighterCoreOptions = {}): Promise<ShikiInternal> {
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
