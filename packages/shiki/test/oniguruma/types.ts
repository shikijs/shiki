import type { IOnigMatch } from '../../../core/src/oniguruma/types'

export interface Instance {
  constractor: [string[]]
  executions: Executions[]
}

export interface Executions {
  args: [str: string, start: number]
  result: IOnigMatch | null
}
