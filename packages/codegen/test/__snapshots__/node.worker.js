import {
  createdBundledHighlighter,
  createSingletonShorthands,
} from '@shikijs/core'
import { createJavaScriptRawEngine } from '@shikijs/engine-javascript/raw'
import { createBirpc } from 'birpc'
import { parentPort } from 'worker_threads'

const bundledLanguages = {
  javascript: () => import('@shikijs/langs-precompiled/javascript'),
  js: () => import('@shikijs/langs-precompiled/javascript'),
  typescript: () => import('@shikijs/langs-precompiled/typescript'),
  ts: () => import('@shikijs/langs-precompiled/typescript'),
  tsx: () => import('@shikijs/langs-precompiled/tsx'),
}

const bundledThemes = {
  nord: () => import('@shikijs/themes/nord'),
  'vitesse-dark': () => import('@shikijs/themes/vitesse-dark'),
}

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRawEngine(),
})

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands(createHighlighter)

const functions = {
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
}
const rpc = createBirpc(functions, {
  on(fn) {
    parentPort?.on('message', fn)
  },
  post(data) {
    parentPort?.postMessage(data)
  },
})

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
  rpc,
  worker,
}
