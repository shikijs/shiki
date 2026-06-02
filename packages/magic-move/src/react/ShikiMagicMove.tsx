import type { HighlighterCore } from 'shiki/core'
import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import * as React from 'react'
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
  className?: string
  tabindex?: number
}

export function ShikiMagicMove(props: ShikiMagicMoveProps) {
  const codeToTokens = React.useRef<(code: string, lineNumbers?: boolean) => KeyedTokensInfo>(
    (code, lineNumbers) => codeToKeyedTokens(
      props.highlighter,
      code,
      {
        lang: props.lang,
        theme: props.theme,
      },
      lineNumbers,
    ),
  )

  const machine = React.useRef<ReturnType<typeof createMagicMoveMachine>>(null)
  machine.current = machine.current || createMagicMoveMachine(
    (code, lineNumbers) => codeToTokens.current!(code, lineNumbers),
  )

  const lineNumbers = props.options?.lineNumbers ?? false

  const result = React.useMemo(
    () => {
      if (
        props.code === machine.current!.current.code
        && props.theme === machine.current!.current.themeName
        && props.lang === machine.current!.current.lang
        && lineNumbers === machine.current!.current.lineNumbers
      ) {
        return machine.current!
      }

      return machine.current!.commit(props.code, props.options)
    },
    [props.code, props.options, props.theme, props.lang, lineNumbers],
  )

  return (
    <ShikiMagicMoveRenderer
      tokens={result.current}
      options={props.options}
      previous={result.previous}
      onStart={props.onStart}
      onEnd={props.onEnd}
      className={props.className}
    />
  )
}
