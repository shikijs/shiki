import type { HighlighterGeneric } from './highlighter'
import type { BundledHighlighterOptions } from './options'

export type CreateHighlighterFactory<L extends string, T extends string> = (
  options: BundledHighlighterOptions<L, T>
) => Promise<HighlighterGeneric<L, T>>
