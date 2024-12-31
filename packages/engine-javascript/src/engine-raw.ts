import type { RegexEngine } from '@shikijs/types'
import type { JavaScriptRegexScannerOptions } from './scanner'
import { JavaScriptScanner } from './scanner'

/**
 * Raw JavaScript regex engine that only supports precompiled grammars.
 *
 * This further simplifies the engine by excluding the regex compilation step.
 *
 * Zero dependencies.
 */
export function createJavaScriptRawEngine(): RegexEngine {
  const options: JavaScriptRegexScannerOptions = {
    cache: new Map(),
    regexConstructor: () => {
      throw new Error('JavaScriptRawEngine: only support precompiled grammar')
    },
  }

  return {
    createScanner(patterns) {
      return new JavaScriptScanner(patterns, options)
    },
    createString(s: string) {
      return {
        content: s,
      }
    },
  }
}
