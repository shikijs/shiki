import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { MagicMoveRenderer as Renderer } from '../renderer'

export class ShikiMagicMoveRenderer extends HTMLElement {
  private _animated: boolean = true
  private _tokens!: KeyedTokensInfo
  private _previous?: KeyedTokensInfo
  private _options?: MagicMoveRenderOptions
  private _class: string = ''

  get animated() {
    return this._animated
  }

  set animated(value: boolean) {
    this._animated = value
    this.propertyChangedCallback()
  }

  get tokens() {
    return this._tokens
  }

  set tokens(value: KeyedTokensInfo) {
    this._tokens = value
    this.propertyChangedCallback()
  }

  get previous(): KeyedTokensInfo | undefined {
    return this._previous
  }

  set previous(value: KeyedTokensInfo) {
    this._previous = value
    this.propertyChangedCallback()
  }

  get options(): MagicMoveRenderOptions | undefined {
    return this._options
  }

  set options(value: MagicMoveRenderOptions | undefined) {
    this._options = value
    if (this.renderer)
      Object.assign(this.renderer.options, this.options)
    this.propertyChangedCallback()
  }

  get class() {
    return this._class
  }

  set class(value: string) {
    this._class = value
    this.propertyChangedCallback()
  }

  private container?: HTMLPreElement

  private renderer?: Renderer

  private batchUpdate = false

  private hasUpdated = false

  constructor() {
    super()
  }

  connectedCallback() {
    this.container = document.createElement('pre')
    this.container.classList.add('shiki-magic-move-container')
    this.container.className += ` ${this.class}`

    this.renderer = new Renderer(this.container)
    this.renderer.render(this.tokens)

    this.appendChild(this.container)
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

        if (this.renderer)
          this.transform()
      }, 0)
    }
  }

  async transform() {
    if (!this.renderer)
      return

    if (!this.animated)
      return

    if (this.previous && this.previous === this.tokens)
      return

    if (this.previous) {
      this.renderer.replace(this.previous)
      this.dispatchEvent(new CustomEvent('onStart'))
      await this.renderer?.render(this.tokens)
      this.dispatchEvent(new CustomEvent('onEnd'))
    }
    else {
      this.renderer.replace(this.tokens)
    }
  }
}

customElements.define('shiki-magic-move-renderer', ShikiMagicMoveRenderer)
