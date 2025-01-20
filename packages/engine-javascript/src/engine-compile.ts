import type { RegexEngine } from '@shikijs/types'
import type { OnigurumaToEsOptions } from 'oniguruma-to-es'
import type { JavaScriptRegexScannerOptions } from './scanner'
import { toRegExp } from 'oniguruma-to-es'
import { JavaScriptScanner } from './scanner'

export interface JavaScriptRegexEngineOptions extends JavaScriptRegexScannerOptions {
  /**
   * The target ECMAScript version.
   *
   * Oniguruma-To-ES uses RegExp features from later versions of ECMAScript to add support for a
   * few more grammars. If using target `ES2024` or later, the RegExp `v` flag is used which
   * requires Node.js 20+ or Chrome 112+.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets
   *
   * For maximum compatibility, you can set it to `ES2018` which uses the RegExp `u` flag.
   *
   * Set to `auto` to automatically detect the latest version supported by the environment.
   *
   * @default 'auto'
   */
  target?: 'auto' | 'ES2025' | 'ES2024' | 'ES2018'
}

/**
 * The default regex constructor for the JavaScript RegExp engine.
 */
export function defaultJavaScriptRegexConstructor(pattern: string, options?: OnigurumaToEsOptions): RegExp {
  return toRegExp(
    pattern,
    {
      global: true,
      hasIndices: true,
      rules: {
        // Needed since TextMate grammars merge backrefs across patterns
        allowOrphanBackrefs: true,
        // Improves search performance for generated regexes
        asciiWordBoundaries: true,
        // Follow `vscode-oniguruma` which enables this Oniguruma option by default
        captureGroup: true,
        // Oniguruma uses depth limit `20`; lowered here to keep regexes shorter and maybe
        // sometimes faster, but can be increased if issues reported due to low limit
        recursionLimit: 5,
        // Oniguruma option for `^`->`\A`, `$`->`\Z`; improves search performance without any
        // change in meaning since TM grammars search line by line
        singleline: true,
      },
      ...options,
    },
  )
}

/**
 * Use the modern JavaScript RegExp engine to implement the OnigScanner.
 *
 * As Oniguruma supports some features that can't be emulated using native JavaScript regexes, some
 * patterns are not supported. Errors will be thrown when parsing TextMate grammars with
 * unsupported patterns, and when the grammar includes patterns that use invalid Oniguruma syntax.
 * Set `forgiving` to `true` to ignore these errors and skip any unsupported or invalid patterns.
 */
export function createJavaScriptRegexEngine(options: JavaScriptRegexEngineOptions = {}): RegexEngine {
  const _options: JavaScriptRegexEngineOptions = Object.assign(
    {
      target: 'auto',
      cache: new Map(),
    },
    options,
  )
  _options.regexConstructor ||= pattern => defaultJavaScriptRegexConstructor(pattern, { target: _options.target })

  return {
    createScanner(patterns) {
      return new JavaScriptScanner(patterns, _options)
    },
    createString(s: string) {
      return {
        content: s,
      }
    },
  }
}
