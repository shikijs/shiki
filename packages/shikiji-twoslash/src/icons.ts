import type { Element } from 'hast'
import type { TwoSlashReturn } from '@typescript/twoslash'
import completionIcons from './icons-completions.json'
import tagIcons from './icons-tags.json'

export type CompletionItem = NonNullable<TwoSlashReturn['queries'][0]['completions']>[0]
export const defaultCompletionIcons: Record<CompletionItem['kind'], Element | undefined> = completionIcons as any

export const defaultCustomTagIcons: Record<string, Element | undefined> = tagIcons as any
