import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import * as React from 'react'
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
export function ShikiMagicMovePrecompiled(
  {
    steps,
    step = 0,
    animate = true,
    options,
    onStart,
    onEnd,
  }: ShikiMagicMovePrecompiledProps,
) {
  const previousRef = React.useRef(EMPTY)

  const result = React.useMemo(() => {
    const res = syncTokenKeys(
      previousRef.current,
      steps[Math.min(step, steps.length - 1)],
      options,
    )
    previousRef.current = res.to
    return res
  }, [steps, step, options])

  return (
    <ShikiMagicMoveRenderer
      tokens={result.to}
      previous={result.from}
      options={options}
      animate={animate}
      onStart={onStart}
      onEnd={onEnd}
    />
  )
}
