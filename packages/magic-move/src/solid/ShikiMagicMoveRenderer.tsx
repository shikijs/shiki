/** @jsxImportSource solid-js */

import type { JSX } from 'solid-js'
import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { createEffect, createSignal } from 'solid-js'
import { MagicMoveRenderer as Renderer } from '../renderer'
import { normalizeCSSProperties } from './utils'

export interface ShikiMagicMoveRendererProps {
  animate?: boolean
  tokens: KeyedTokensInfo
  previous?: KeyedTokensInfo
  options?: MagicMoveRenderOptions
  onStart?: () => void
  onEnd?: () => void
  class?: string
  style?: JSX.CSSProperties
}

/**
 * A wrapper component to `MagicMoveRenderer`
 */
export function ShikiMagicMoveRenderer(props: ShikiMagicMoveRendererProps) {
  let container!: HTMLPreElement
  let renderer: Renderer
  const [isMounted, setIsMounted] = createSignal(false)

  createEffect(() => {
    if (!container)
      return
    // Remove previous content
    container.innerHTML = ''
    setIsMounted(true)
    renderer = new Renderer(container)
  })

  createEffect(() => {
    async function render() {
      if (!renderer)
        return

      Object.assign(renderer.options, props.options)
      if (props.animate === undefined || props.animate === true) {
        if (props.previous)
          renderer.replace(props.previous)

        props.onStart?.()
        await renderer.render(props.tokens)
        props.onEnd?.()
      }
      else {
        renderer.replace(props.tokens)
      }
    }

    render()
  })

  return (
    <pre
      ref={container}
      class={`shiki-magic-move-container ${props.class || ''}`.trim()}
      style={props.style}
    >
      {
        // Render initial tokens for SSR
      }
      <div>
        {isMounted()
          ? undefined
          : props.tokens?.tokens.map((token) => {
              if (token.content === '\n')
                return <br />

              return (
                <span
                  style={{
                    ...normalizeCSSProperties(token.htmlStyle),
                    color: token.color,
                  }}
                  class={['shiki-magic-move-item', token.htmlClass]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {token.content}
                </span>
              )
            })}
      </div>
    </pre>
  )
}
