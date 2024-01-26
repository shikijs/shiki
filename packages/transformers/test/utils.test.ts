import { describe, expect, it } from 'vitest'
import { separateContinuousSpaces } from '../src/shared/utils'

describe('utils', () => {
  it('separateContinuousSpaces', () => {
    expect(
      separateContinuousSpaces([' ', ' ', 'bar', ' ']),
    )
      .toEqual([' ', ' ', 'bar '])

    expect(
      separateContinuousSpaces(['foo', ' ', ' ', 'bar', ' ', 'baz']),
    )
      .toEqual(['foo', ' ', ' ', 'bar baz'])

    expect(
      separateContinuousSpaces(['foo', '\t', 'bar', ' ', ' ', 'baz']),
    )
      .toEqual(['foo', '\t', 'bar', ' ', ' ', 'baz'])

    expect(
      separateContinuousSpaces([' ', 'bar', ' ']),
    )
      .toEqual([' bar '])

    expect(
      separateContinuousSpaces(['plugins:', ' ', ' ', '[']),
    )
      .toEqual(['plugins:', ' ', ' ', '['])
  })
})
