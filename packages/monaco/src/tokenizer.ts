import type { StateStack } from '@shikijs/vscode-textmate'
import type monacoNs from 'monaco-editor-core'

export class TokenizerState implements monacoNs.languages.IState {
  constructor(
    private _ruleStack: StateStack,
  ) { }

  public get ruleStack(): StateStack {
    return this._ruleStack
  }

  public clone(): TokenizerState {
    return new TokenizerState(this._ruleStack)
  }

  public equals(other: monacoNs.languages.IState): boolean {
    if (
      !other
      || !(other instanceof TokenizerState)
      || other !== this
      || other._ruleStack !== this._ruleStack
    ) {
      return false
    }

    return true
  }
}
