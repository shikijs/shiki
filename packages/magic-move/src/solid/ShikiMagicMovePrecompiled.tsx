/** @jsxImportSource solid-js */

import type {
  KeyedTokensInfo,
  MagicMoveDifferOptions,
  MagicMoveRenderOptions,
} from '../types'
import { createMemo, createSignal } from 'solid-js'
import { syncTokenKeys, toKeyedTokens } from '../core'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

export interface ShikiMagicMovePrecompiledProps {
  steps: KeyedTokensInfo[]
  step?: number
  animate?: boolean
  options?: MagicMoveRenderOptions & MagicMoveDifferOptions
  onStart?: () => void
  onEnd?: () => void
}

const EMPTY = /* @__PURE__ */ toKeyedTokens('', [])

/**
 * Component to render a compiled magic move step,
 * Where the tokens can be generated on build time.
 */
export function ShikiMagicMovePrecompiled(props: ShikiMagicMovePrecompiledProps) {
  const [previous, setPrevious] = createSignal(EMPTY)

  const result = createMemo(() => {
    const res = syncTokenKeys(
      previous(),
      props.steps[Math.min(props.step ?? 0, props.steps.length - 1)],
      props.options,
    )
    setPrevious(res.to)
    return res
  })

  return (
    <ShikiMagicMoveRenderer
      tokens={result().to}
      previous={result().from}
      options={props.options}
      animate={props.animate ?? true}
      onStart={props.onStart}
      onEnd={props.onEnd}
    />
  )
}
