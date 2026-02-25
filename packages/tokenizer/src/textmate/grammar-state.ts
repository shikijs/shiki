import type { GrammarState as GrammarStateInterface, GrammarStateMapKey } from '@shikijs/types'
import type { StateStack, StateStackImpl } from '@shikijs/vscode-textmate'

import { ShikiError } from '@shikijs/types'
import { INITIAL } from '@shikijs/vscode-textmate'
import { toArray } from '../utils'

const _grammarStateMap = new WeakMap<GrammarStateMapKey, GrammarStateInterface>()

export function setLastGrammarStateToMap(
  keys: GrammarStateMapKey,
  state: GrammarStateInterface,
): void {
  _grammarStateMap.set(keys, state)
}

export function getLastGrammarStateFromMap(
  keys: GrammarStateMapKey,
): GrammarStateInterface | undefined {
  return _grammarStateMap.get(keys)
}

/**
 * GrammarState is a special reference object that holds the state of a grammar.
 *
 * It's used to highlight code snippets that are part of the target language.
 */
export class GrammarState implements GrammarStateInterface {
  /**
   * Theme to Stack mapping
   */
  private _stacks: Record<string, StateStack> = {}
  public readonly lang: string

  get themes(): string[] {
    return Object.keys(this._stacks)
  }

  get theme(): string {
    return this.themes[0]
  }

  private get _stack(): StateStack {
    return this._stacks[this.theme]
  }

  /**
   * Static method to create a initial grammar state.
   */
  static initial(lang: string, themes: string | string[]): GrammarState {
    return new GrammarState(
      Object.fromEntries(toArray(themes).map(theme => [theme, INITIAL])),
      lang,
    )
  }

  constructor(
    stack: StateStack,
    lang: string,
    theme: string,
  )
  constructor(
    stacksMap: Record<string, StateStack>,
    lang: string,
  )
  constructor(...args: any[]) {
    if (args.length === 2) {
      const [stacksMap, lang] = args as [Record<string, StateStack>, string]
      this.lang = lang
      this._stacks = stacksMap
    }
    else {
      const [stack, lang, theme] = args as [StateStack, string, string]
      this.lang = lang
      this._stacks = { [theme]: stack }
    }
  }

  /**
   * Get the internal stack object.
   * @internal
   */
  getInternalStack(theme = this.theme): StateStack | undefined {
    return this._stacks[theme]
  }

  getScopes(theme: string = this.theme): string[] {
    return getScopes(this._stacks[theme] as StateStackImpl)
  }

  toJSON(): {
    lang: string
    theme: string
    themes: string[]
    scopes: string[]
  } {
    return {
      lang: this.lang,
      theme: this.theme,
      themes: this.themes,
      scopes: this.getScopes(),
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

export function getGrammarStack(
  state: GrammarState | GrammarStateInterface,
  theme?: string,
): StateStack | undefined {
  if (!(state instanceof GrammarState))
    throw new ShikiError('Invalid grammar state')
  return state.getInternalStack(theme)
}
