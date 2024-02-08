import type { Element } from 'hast'
import type { NodeCompletion } from 'twoslash'
import completionIcons from './icons-completions.json'
import tagIcons from './icons-tags.json'

export type CompletionItem = NonNullable<NodeCompletion['completions']>[number]

export const defaultCompletionIcons: Record<string, Element | undefined> = completionIcons as any
export const defaultCustomTagIcons: Record<string, Element | undefined> = tagIcons as any
