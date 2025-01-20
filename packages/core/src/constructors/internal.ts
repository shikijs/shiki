import type {
  HighlighterCoreOptions,
  ShikiInternal,
} from '@shikijs/types'
import { createOnigurumaEngine, getDefaultWasmLoader } from '@shikijs/engine-oniguruma'

import { resolveLangs, resolveThemes } from '../textmate/getters-resolve'
import { warnDeprecated } from '../warn'
import { createShikiInternalSync } from './internal-sync'

/**
 * Get the minimal shiki context for rendering.
 */
export async function createShikiInternal(options: HighlighterCoreOptions): Promise<ShikiInternal> {
  if (options.loadWasm) {
    warnDeprecated('`loadWasm` option is deprecated. Use `engine: createOnigurumaEngine(loadWasm)` instead.')
  }
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
    (options.engine || createOnigurumaEngine(options.loadWasm || getDefaultWasmLoader())),
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
export function getShikiInternal(options: HighlighterCoreOptions): Promise<ShikiInternal> {
  warnDeprecated('`getShikiInternal` is deprecated. Use `createShikiInternal` instead.')
  return createShikiInternal(options)
}
