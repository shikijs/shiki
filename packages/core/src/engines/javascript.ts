import type { JavaScriptRegexEngineOptions } from '@shikijs/engine-javascript'
import type { RegexEngine } from '@shikijs/types'
import {
  createJavaScriptRegexEngine as _createJavaScriptRegexEngine,
  defaultJavaScriptRegexConstructor as _defaultJavaScriptRegexConstructor,
} from '@shikijs/engine-javascript'
import { warnDeprecated } from '../warn'

/**
 * @deprecated Import `createJavaScriptRegexEngine` from `@shikijs/engine-javascript` or `shiki/engine/javascript` instead.
 */
export function createJavaScriptRegexEngine(options?: JavaScriptRegexEngineOptions): RegexEngine {
  warnDeprecated('import `createJavaScriptRegexEngine` from `@shikijs/engine-javascript` or `shiki/engine/javascript` instead')
  return _createJavaScriptRegexEngine(options)
}

/**
 * @deprecated Import `defaultJavaScriptRegexConstructor` from `@shikijs/engine-javascript` or `shiki/engine/javascript` instead.
 */
export function defaultJavaScriptRegexConstructor(pattern: string): RegExp {
  warnDeprecated('import `defaultJavaScriptRegexConstructor` from `@shikijs/engine-javascript` or `shiki/engine/javascript` instead')
  return _defaultJavaScriptRegexConstructor(pattern)
}
