import { bundledThemes } from '../themes'
import { bundledLanguages } from '../langs'
import { getWasmInlined } from '../wasm'
import { createdBundledHighlighter } from '../core'
import type { BuiltinLanguages, BuiltinThemes } from '../types'

export type Highlighter = Awaited<ReturnType<typeof getHighlighter>>

export const getHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BuiltinLanguages,
  BuiltinThemes
>(
  bundledLanguages,
  bundledThemes,
  getWasmInlined,
)
