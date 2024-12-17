import type { IOnigMatch } from '@shikijs/vscode-textmate'

export interface Instance {
  constractor: [string[]]
  executions: Executions[]
}

export interface Executions {
  args: [str: string, start: number, options: number]
  result: IOnigMatch | null
}
