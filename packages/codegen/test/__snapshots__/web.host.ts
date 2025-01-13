import { createBirpc } from 'birpc'
import type { RpcFunctions } from './web.worker.ts'

export const worker = new Worker(new URL('./web.worker.ts', import.meta.url))
export const rpc = createBirpc<RpcFunctions>(
  {},
  {
    on(fn) {
      worker.onmessage = (e) => {
        fn(e.data)
      }
    },
    post(data) {
      worker.postMessage(data)
    },
    serialize(data) {
      return JSON.stringify(data)
    },
    deserialize(data) {
      return JSON.parse(data)
    },
  },
)

export const codeToHast = rpc.codeToHast
export const codeToHtml = rpc.codeToHtml
export const codeToTokens = rpc.codeToTokens
export const codeToTokensBase = rpc.codeToTokensBase
export const codeToTokensWithThemes = rpc.codeToTokensWithThemes
