import type {
  HighlighterCoreOptions,
  ShikiInternal,
} from '@shikijs/types'
import { createWasmOnigEngine } from '@shikijs/engine-oniguruma'

import { getDefaultWasmLoader } from '../engines/oniguruma'
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
    (options.engine || createWasmOnigEngine(options.loadWasm || getDefaultWasmLoader())),
  ] as const)

  return createShikiInternalSync({
    ...options,
    loadWasm: undefined,
    themes,
    langs,
    engine,
  })
}

/**
 * @deprecated Use `createShikiInternal` instead.
 */
export function getShikiInternal(options: HighlighterCoreOptions = {}): Promise<ShikiInternal> {
  // TODO: next: console.warn('`getShikiInternal` is deprecated. Use `createShikiInternal` instead.')
  return createShikiInternal(options)
}
