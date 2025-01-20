let _emitDeprecation: DeprecationTarget | boolean = 3
let _emitError = false

export type DeprecationTarget = 3

/**
 * Enable runtime warning for deprecated APIs, for the future versions of Shiki.
 *
 * You can pass a major version to only warn for deprecations that will be removed in that version.
 *
 * By default, deprecation warning is set to 3 since Shiki v2.0.0
 */
export function enableDeprecationWarnings(
  emitDeprecation: DeprecationTarget | boolean = true,
  emitError = false,
): void {
  _emitDeprecation = emitDeprecation
  _emitError = emitError
}

/**
 * @internal
 */
export function warnDeprecated(message: string, version: DeprecationTarget = 3): void {
  if (!_emitDeprecation)
    return
  if (typeof _emitDeprecation === 'number' && version > _emitDeprecation)
    return

  if (_emitError) {
    throw new Error(`[SHIKI DEPRECATE]: ${message}`)
  }
  else {
    // eslint-disable-next-line no-console
    console.trace(`[SHIKI DEPRECATE]: ${message}`)
  }
}
