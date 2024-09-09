import type { Element } from 'hast'

export interface DecorationOptions {
  /**
   * Custom decorations to wrap highlighted tokens with.
   */
  decorations?: DecorationItem[]
}

export interface DecorationItem {
  /**
   * Start offset or position of the decoration.
   */
  start: OffsetOrPosition
  /**
   * End offset or position of the decoration.
   */
  end: OffsetOrPosition
  /**
   * Tag name of the element to create.
   * @default 'span'
   */
  tagName?: string
  /**
   * Properties of the element to create.
   */
  properties?: Element['properties']
  /**
   * A custom function to transform the element after it has been created.
   */
  transform?: (element: Element, type: DecorationTransformType) => Element | void

  /**
   * By default when the decoration contains only one token, the decoration will be applied to the token.
   *
   * Set to `true` to always wrap the token with a new element
   *
   * @default false
   */
  alwaysWrap?: boolean
}

export interface ResolvedDecorationItem extends Omit<DecorationItem, 'start' | 'end'> {
  start: ResolvedPosition
  end: ResolvedPosition
}

export type DecorationTransformType = 'wrapper' | 'line' | 'token'

export interface Position {
  line: number
  character: number
}

export type Offset = number
export type OffsetOrPosition = Position | Offset

export interface ResolvedPosition extends Position {
  offset: Offset
}
