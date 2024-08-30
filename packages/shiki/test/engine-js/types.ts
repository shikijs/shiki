import type { IOnigMatch } from '../../../core/vendor/vscode-textmate/src/main'

export interface Instance {
  constractor: [string[]]
  executions: Executions[]
}

export interface Executions {
  args: [str: string, start: number]
  result: IOnigMatch | null
}
