import type { StateStackImpl } from '../vendor/vscode-textmate/src/grammar'
import { ShikiError } from './error'
import type { StateStack } from './textmate'

/**
 * GrammarState is a special reference object that holds the state of a grammar.
 *
 * It's used to highlight code snippets that are part of the target language.
 */
export class GrammarState {
  constructor(
    private _stack: StateStack,
    public lang: string,
    public theme: string,
  ) {}

  get scopes() {
    return getScopes(this._stack as StateStackImpl)
  }

  toJSON() {
    return {
      lang: this.lang,
      theme: this.theme,
      scopes: this.scopes,
    }
  }
}

function getScopes(stack: StateStackImpl) {
  const scopes: string[] = []
  const visited = new Set<StateStackImpl>()

  function pushScope(stack: StateStackImpl) {
    if (visited.has(stack))
      return
    visited.add(stack)
    const name = stack?.nameScopesList?.scopeName
    if (name)
      scopes.push(name)
    if (stack.parent)
      pushScope(stack.parent)
  }

  pushScope(stack)
  return scopes
}

export function getGrammarStack(state: GrammarState) {
  if (!(state instanceof GrammarState))
    throw new ShikiError('Invalid grammar state')
  // @ts-expect-error _stack is private
  return state._stack
}
