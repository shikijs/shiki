import type { IOnigMatch } from '@shikijs/vscode-textmate'

export interface Execution {
  id: string
  patterns: string[]
  args: [str: string, start: number, options: number]
  result: IOnigMatch | null
}
