import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import type { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

import { syncTokenKeys, toKeyedTokens } from '../core'

export class ShikiMagicMovePrecompiled extends HTMLElement {
  private _steps: KeyedTokensInfo[] = []
  private _step: number = 0
  private _animated: boolean = true
  private _options?: MagicMoveRenderOptions & MagicMoveDifferOptions

  get steps() {
    return this._steps
  }

  set steps(value: KeyedTokensInfo[]) {
    this._steps = value
    this.propertyChangedCallback()
  }

  get step() {
    return this._step
  }

  set step(value: number) {
    this._step = value
    this.propertyChangedCallback()
  }

  get animated() {
    return this._animated
  }

  set animated(value: boolean) {
    this._animated = value
    this.propertyChangedCallback()
  }

  get options(): MagicMoveRenderOptions & MagicMoveDifferOptions | undefined {
    return this._options
  }

  set options(value: MagicMoveRenderOptions & MagicMoveDifferOptions) {
    this._options = value
    this.propertyChangedCallback()
  }

  private renderer?: ShikiMagicMoveRenderer

  private previous: KeyedTokensInfo = toKeyedTokens('', [])

  private batchUpdate = false

  private hasUpdated = false

  constructor() {
    super()
  }

  connectedCallback() {
    this.renderer = document.createElement('shiki-magic-move-renderer') as ShikiMagicMoveRenderer
    this.renderer.addEventListener('onStart', () => this.dispatchEvent(new CustomEvent('onStart')))
    this.renderer.addEventListener('onEnd', () => this.dispatchEvent(new CustomEvent('onEnd')))

    this.updateRenderer()

    this.appendChild(this.renderer)
  }

  propertyChangedCallback() {
    if (!this.batchUpdate) {
      this.batchUpdate = true

      setTimeout(() => {
        this.batchUpdate = false

        if (!this.hasUpdated) {
          this.hasUpdated = true
          return
        }

        this.updateRenderer()
      }, 0)
    }
  }

  updateRenderer() {
    const result = syncTokenKeys(
      this.previous,
      this.steps[Math.min(this.step, this.steps.length - 1)],
      this.options,
    )
    this.previous = result.to

    this.renderer!.tokens = result.to
    this.renderer!.previous = result.from
    this.renderer!.options = this.options
    this.renderer!.animated = this.animated
  }
}

customElements.define('shiki-magic-move-precompiled', ShikiMagicMovePrecompiled)
