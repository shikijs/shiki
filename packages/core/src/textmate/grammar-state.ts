import type { GrammarState as GrammarStateInterface } from '@shikijs/types'
import type { StateStack, StateStackImpl } from '@shikijs/vscode-textmate'

import { INITIAL } from '@shikijs/vscode-textmate'
import { ShikiError } from '../../../types/src/error'

/**
 * GrammarState is a special reference object that holds the state of a grammar.
 *
 * It's used to highlight code snippets that are part of the target language.
 */
export class GrammarState implements GrammarStateInterface {
  /**
   * Static method to create a initial grammar state.
   */
  static initial(lang: string, theme: string): GrammarState {
    return new GrammarState(INITIAL, lang, theme)
  }

  constructor(
    private readonly _stack: StateStack,
    public readonly lang: string,
    public readonly theme: string,
  ) {}

  get scopes(): string[] {
    return getScopes(this._stack as StateStackImpl)
  }

  toJSON(): {
    lang: string
    theme: string
    scopes: string[]
  } {
    return {
      lang: this.lang,
      theme: this.theme,
      scopes: this.scopes,
    }
  }
}

function getScopes(stack: StateStackImpl): string[] {
  const scopes: string[] = []
  const visited = new Set<StateStackImpl>()

  function pushScope(stack: StateStackImpl): void {
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

export function getGrammarStack(state: GrammarState | GrammarStateInterface): StateStack {
  if (!(state instanceof GrammarState))
    throw new ShikiError('Invalid grammar state')
  // @ts-expect-error _stack is private
  return state._stack
}
