let emitDeprecation = false

/**
 * Enable runtime warning for deprecated APIs, for the future versions of Shiki.
 *
 * Disabled by default, will be enabled in Shiki v2.
 *
 * @experimental The accuracy of the warning messages is not yet guaranteed.
 */
export function enableDeprecationWarnings(value = true): void {
  emitDeprecation = value
}

/**
 * @internal
 */
export function warnDeprecated(message: string): void {
  if (emitDeprecation)
    // eslint-disable-next-line no-console
    console.trace(`[SHIKI DEPRECATE]: ${message}`)
}
