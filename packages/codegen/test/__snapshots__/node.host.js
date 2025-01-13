import { createBirpc } from 'birpc'
import { Worker } from 'worker_threads'

export const worker = new Worker('./node.worker.js')
export const rpc = createBirpc(
  {},
  {
    on(fn) {
      worker.on('message', fn)
    },
    post(data) {
      worker.postMessage(data)
    },
  },
)

export const codeToHast = rpc.codeToHast
export const codeToHtml = rpc.codeToHtml
export const codeToTokens = rpc.codeToTokens
export const codeToTokensBase = rpc.codeToTokensBase
export const codeToTokensWithThemes = rpc.codeToTokensWithThemes
