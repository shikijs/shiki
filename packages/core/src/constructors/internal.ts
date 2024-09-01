import type {
  HighlighterCoreOptions,
  LoadWasmOptions,
  ShikiInternal,
} from '../types'
import { createWasmOnigEngine } from '../engines/wasm'
import { resolveLangs, resolveThemes } from '../textmate/getters-resolve'
import { createShikiInternalSync } from './internal-sync'

let _defaultWasmLoader: LoadWasmOptions | undefined
/**
 * Set the default wasm loader for `loadWasm`.
 * @internal
 */
export function setDefaultWasmLoader(_loader: LoadWasmOptions) {
  _defaultWasmLoader = _loader
}

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
    (options.engine || createWasmOnigEngine(options.loadWasm || _defaultWasmLoader)),
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
