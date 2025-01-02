import type { LanguageRegistration } from '@shikijs/types'
import { traverseGrammarPatterns } from '../../../scripts/utils'
import { defaultJavaScriptRegexConstructor } from '../../engine-javascript/src/engine-compile'

export function precompileGrammar(grammar: LanguageRegistration): LanguageRegistration {
  const precompiled: LanguageRegistration = structuredClone(grammar)

  traverseGrammarPatterns(precompiled, (pattern) => {
    if (typeof pattern !== 'string')
      return pattern
    return defaultJavaScriptRegexConstructor(pattern, {
      target: 'ES2024',
    })
  })

  return precompiled
}
