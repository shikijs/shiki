import type { JavaScriptRegexEngineOptions } from '@shikijs/engine-javascript'
import type { RegexEngine } from '@shikijs/types'
import { createJavaScriptRegexEngine as _createJavaScriptRegexEngine, defaultJavaScriptRegexConstructor } from '@shikijs/engine-javascript'
import { warnDeprecated } from '../warn'

export function createJavaScriptRegexEngine(options?: JavaScriptRegexEngineOptions): RegexEngine {
  warnDeprecated('import `createJavaScriptRegexEngine` from `@shikijs/engine-javascript` or `shiki/engine/javascript` instead')
  return _createJavaScriptRegexEngine(options)
}

export { defaultJavaScriptRegexConstructor }
