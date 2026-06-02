import type { App } from 'vue'
import { ShikiMagicMove } from './ShikiMagicMove'
import { ShikiMagicMovePrecompiled } from './ShikiMagicMovePrecompiled'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

export {
  ShikiMagicMove,
  ShikiMagicMovePrecompiled,
  ShikiMagicMoveRenderer,
}

export function install(app: App<any>) {
  app.component('ShikiMagicMove', ShikiMagicMove)
  app.component('ShikiMagicMovePrecompiled', ShikiMagicMovePrecompiled)
  app.component('ShikiMagicMoveRenderer', ShikiMagicMoveRenderer)
}
