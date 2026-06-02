import type { HighlighterCore } from 'shiki/core'
import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import type { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'

import './ShikiMagicMoveRenderer'

export class ShikiMagicMove extends HTMLElement {
  private _highlighter!: HighlighterCore
  private _lang!: string
  private _theme!: string
  private _code!: string
  private _class?: string
  private _options?: MagicMoveRenderOptions & MagicMoveDifferOptions

  get highlighter() {
    return this._highlighter
  }

  set highlighter(value: HighlighterCore) {
    this._highlighter = value
    this.propertyChangedCallback()
  }

  get lang() {
    return this._lang
  }

  set lang(value: string) {
    this._lang = value
    this.propertyChangedCallback()
  }

  get theme() {
    return this._theme
  }

  set theme(value: string) {
    this._theme = value
    this.propertyChangedCallback()
  }

  get code() {
    return this._code
  }

  set code(value: string) {
    this._code = value
    this.propertyChangedCallback()
  }

  get class() {
    return this._class
  }

  set class(value: string | undefined) {
    this._class = value
    this.propertyChangedCallback()
  }

  get options() {
    return this._options
  }

  set options(value: MagicMoveRenderOptions & MagicMoveDifferOptions | undefined) {
    this._options = value
    this.propertyChangedCallback()
  }

  private machine?: {
    commit: (code: string, override?: MagicMoveDifferOptions) => {
      current: KeyedTokensInfo
      previous: KeyedTokensInfo
    }
  }

  private renderer?: ShikiMagicMoveRenderer

  private result?: { current: KeyedTokensInfo, previous: KeyedTokensInfo }

  private batchUpdate = false

  private hasUpdated = false

  constructor() {
    super()
  }

  connectedCallback() {
    this.renderer = document.createElement('shiki-magic-move-renderer') as ShikiMagicMoveRenderer
    this.renderer.addEventListener('onStart', () => this.dispatchEvent(new CustomEvent('onStart')))
    this.renderer.addEventListener('onEnd', () => this.dispatchEvent(new CustomEvent('onEnd')))

    this.machine = createMagicMoveMachine(
      code => codeToKeyedTokens(
        this.highlighter,
        code,
        {
          lang: this.lang,
          theme: this.theme,
        },
        this.options?.lineNumbers,
      ),
      this.options,
    )

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
    if (this.machine && this.renderer) {
      this.result = this.machine.commit(this.code, this.options)

      this.renderer.tokens = this.result!.current
      this.renderer.previous = this.result!.previous
      this.renderer.options = this.options
      this.renderer.class = this.class ?? ''
    }
  }
}

customElements.define('shiki-magic-move', ShikiMagicMove)
