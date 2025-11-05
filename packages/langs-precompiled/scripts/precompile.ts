import type { LanguageRegistration } from '@shikijs/types'
import { traverseGrammarPatterns } from '../../../scripts/utils'
import { defaultJavaScriptRegexConstructor } from '../../engine-javascript/src/engine-compile'

export function precompileGrammar(grammar: LanguageRegistration): LanguageRegistration {
  const precompiled: LanguageRegistration = structuredClone(grammar)

  traverseGrammarPatterns(precompiled, (pattern) => {
    if (typeof pattern !== 'string')
      return pattern
    // Use ES2018 target for maximum compatibility (Node 18+)
    // ES2024+ requires Node 20+ due to RegExp 'v' flag
    return defaultJavaScriptRegexConstructor(pattern, {
      target: 'ES2018',
    })
  })

  return precompiled
}
