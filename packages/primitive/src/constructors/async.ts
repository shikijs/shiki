import type { HighlighterCoreOptions, ShikiPrimitive } from '@shikijs/types'
import { resolveLangs, resolveThemes } from '../textmate/getters-resolve'
import { createShikiPrimitive } from './primitive'

/**
 * Get the minimal shiki primitive instance.
 */
export async function createShikiPrimitiveAsync(options: HighlighterCoreOptions): Promise<ShikiPrimitive> {
  if (!options.engine) {
    console.warn('`engine` option is required. Use `createOnigurumaEngine` or `createJavaScriptRegexEngine` to create an engine.')
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

  return createShikiPrimitive({
    ...options,
    themes,
    langs,
    engine,
  })
}

/**
 * @deprecated Use `createShikiPrimitiveAsync` instead.
 */
export const createShikiInternal = createShikiPrimitiveAsync
