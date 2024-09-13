import { describe, expect, it } from 'vitest'
import { expandRecursiveBackReference } from '../scripts/utils'

describe('expandRecursiveBackReference', () => {
  it('case 1', () => {
    const name = 'square'
    const regex = '(?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*\\])'
    const fallback = '(?:[^\\[\\]\\\\])'

    expect(expandRecursiveBackReference(regex, name, fallback, 0))
      .toMatchInlineSnapshot(`"(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\])*\\])"`)

    expect(expandRecursiveBackReference(regex, name, fallback, 1))
      .toMatchInlineSnapshot(`"(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\])*\\])*\\])"`)

    expect(expandRecursiveBackReference(regex, name, fallback, 2))
      .toMatchInlineSnapshot(`"(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\])*\\])*\\])*\\])"`)
  })
})
