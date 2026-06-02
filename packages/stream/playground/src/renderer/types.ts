import type { ThemedToken } from 'shiki/core'
import type { RecallToken } from '../../../src'

export type RendererType = 'vue' | 'react' | 'solid'

export interface RendererUpdatePayload {
  stream: ReadableStream<ThemedToken | RecallToken>
}

export interface RendererFactoryResult {
  dispose: () => void
  mount: (element: HTMLElement, payload: RendererUpdatePayload) => void
  update: (payload: RendererUpdatePayload) => void
}

export interface RendererFactoryOptions {
  onStart?: () => void
  onEnd?: () => void
}

export type RendererFactory = (options: RendererFactoryOptions) => RendererFactoryResult
