// This is a workaround for the minimatch type issues
declare module 'minimatch' {
  import { IMinimatch } from 'minimatch'

  export = IMinimatch
}
