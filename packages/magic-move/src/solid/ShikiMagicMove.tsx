/** @jsxImportSource solid-js */

import type { HighlighterCore } from 'shiki/core'
import type { MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { createMemo } from 'solid-js'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

export interface ShikiMagicMoveProps {
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

export function ShikiMagicMove(props: ShikiMagicMoveProps) {
  const codeToTokens = (code: string, lineNumbers?: boolean) =>
    codeToKeyedTokens(
      props.highlighter,
      code,
      {
        lang: props.lang,
        theme: props.theme,
      },
      lineNumbers,
    )

  const machine = createMagicMoveMachine((code, lineNumbers) =>
    codeToTokens(code, lineNumbers),
  )

  const result = createMemo(() => {
    const lineNumbers = props.options?.lineNumbers ?? false
    if (
      props.code === machine.current.code
      && props.theme === machine.current.themeName
      && props.lang === machine.current.lang
      && lineNumbers === machine.current.lineNumbers
    ) {
      return machine
    }

    return machine.commit(props.code, props.options)
  })

  return (
    <ShikiMagicMoveRenderer
      tokens={result().current}
      options={props.options}
      previous={result().previous}
      onStart={props.onStart}
      onEnd={props.onEnd}
      class={props.class}
    />
  )
}
