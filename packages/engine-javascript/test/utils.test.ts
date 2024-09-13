import { describe, expect, it } from 'vitest'
import { expandRecursiveBackReference } from '../scripts/utils'

describe('expandRecursiveBackReference', () => {
  it('case 1', () => {
    const name = 'square'
    const regex = '(?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*\\])'
    const fallback = '(?:[^\\[\\]\\\\])'

    expect(expandRecursiveBackReference(regex, name, fallback, 0))
      .toMatchInlineSnapshot(`"(?<square>[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\])*\\])"`)

    expect(expandRecursiveBackReference(regex, name, fallback, 1))
      .toMatchInlineSnapshot(`"(?<square>[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\])*\\])*\\])"`)

    expect(expandRecursiveBackReference(regex, name, fallback, 2))
      .toMatchInlineSnapshot(`"(?<square>[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\]|\\\\.|\\[(?:[^\\[\\]\\\\])*\\])*\\])*\\])"`)
  })

  it('case 2', () => {
    const name = 'url'
    const regex = '(?<url>(?>[^\\s()]+)|\\(\\g<url>*\\))'
    const fallback = '(?>[^\\s()]+)'

    expect(expandRecursiveBackReference(regex, name, fallback, 0))
      .toMatchInlineSnapshot(`"(?<url>(?>[^\\s()]+)|\\((?>[^\\s()]+)*\\))"`)
  })
})
