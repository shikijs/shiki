import type { Diff } from 'diff-match-patch-es'
import type { ThemedToken, TokensResult } from 'shiki/core'

export type Range = [number, number]

export interface MatchedRanges {
  from: Range
  to: Range
  content: string
}

export interface KeyedToken extends ThemedToken {
  key: string
  htmlClass?: string
}

export interface KeyedTokensInfo extends Pick<TokensResult, 'bg' | 'fg' | 'rootStyle' | 'themeName'> {
  code: string
  hash: string
  tokens: KeyedToken[]
  lang?: string
  lineNumbers: boolean
}

export interface MagicMoveRenderOptions {
  /**
   * Duration of the animation in milliseconds
   *
   * @default 500
   */
  duration?: number
  /**
   * Ratio of the duration to delay the move animation
   *
   * @default 0.3
   */
  delayMove?: number
  /**
   * Ratio of the duration to delay the leave animation
   *
   * @default 0
   */
  delayLeave?: number
  /**
   * Ratio of the duration to delay the enter animation
   *
   * @default 0.7
   */
  delayEnter?: number
  /**
   * Ratio of the duration to delay the container animation
   *
   * @default 0.4
   */
  delayContainer?: number
  /**
   * Easing function
   *
   * @default 'ease'
   */
  easing?: string

  /**
   * Scale applies to the container or it's parents.
   * Used to calculate the correct positions of the elements.
   *
   * @default 1
   */
  globalScale?: number

  /**
   * Apply animation to the container
   */
  animateContainer?: boolean

  /**
   * Apply styles (color and background) to the container
   *
   * @default true
   */
  containerStyle?: boolean

  /**
   * Stagger the animation of the tokens, in milliseconds
   *
   * @default 0
   */
  stagger?: number
}

export interface MagicMoveDifferOptions {
  /**
   * Show line numbers
   *
   * @default false
   */
  lineNumbers?: boolean
  /**
   * Split the tokens at the edge of diff chunks
   *
   * @default false
   */
  splitTokens?: boolean
  /**
   * Algorithm to use to cleanup the diff
   */
  diffCleanup?: ((diffs: Diff[]) => Diff[] | void)
  /**
   * Enhance the matching algorithm to match tokens that has same content
   */
  enhanceMatching?: boolean
}
