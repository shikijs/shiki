import type { ShikiMagicMove } from './ShikiMagicMove'
import type { ShikiMagicMovePrecompiled } from './ShikiMagicMovePrecompiled'
import type { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

declare global {
  interface HTMLElementTagNameMap {
    'shiki-magic-move': ShikiMagicMove
    'shiki-magic-move-precompiled': ShikiMagicMovePrecompiled
    'shiki-magic-move-renderer': ShikiMagicMoveRenderer
  }
}
