<script lang='ts'>
  import type { MagicMoveDifferOptions, MagicMoveRenderOptions } from '@shikijs/magic-move/types'
  import type { HighlighterCore } from 'shiki/core'
  import { codeToKeyedTokens, createMagicMoveMachine } from '@shikijs/magic-move/core'
  import ShikiMagicMoveRenderer from './ShikiMagicMoveRenderer.svelte'

  interface ShikiMagicMoveProps {
    highlighter: HighlighterCore
    lang: string
    theme: string
    code: string
    options?: MagicMoveRenderOptions & MagicMoveDifferOptions
    onStart?: () => void
    onEnd?: () => void
    class?: string
    tabindex?: number
  }

  const { highlighter, lang, theme, code, options, onStart, onEnd, ...props }: ShikiMagicMoveProps = $props()
  const machine = createMagicMoveMachine(
    code => codeToKeyedTokens(highlighter, code, { lang, theme }, options?.lineNumbers),
    options,
  )
  const result = $derived(machine.commit(code))
</script>

<ShikiMagicMoveRenderer
  tokens={result.current}
  previous={result.previous}
  {options}
  {onStart}
  {onEnd}
  {...props}
/>
