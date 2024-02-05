/* eslint-disable style/no-tabs */
import { describe, expect, it } from 'vitest'
import { splitLines } from '../src/utils'

describe('utils', () => {
  it('splitLines', () => {
    const lines = [
      '\t*/\r',
      '\tpublic void setTestingRefNum(long l) {\r',
      '\ttestingRefNum = l;\r',
      '\t}\r',
    ]
    const code = lines.join('\n')

    const resultWithEnding = splitLines(code, true)
    const resultWithoutEnding = splitLines(code, false)
    const reconstructed = resultWithEnding.map(([line]) => line).join('')
    expect(reconstructed).toBe(code)
    // the offset should be the same
    expect(resultWithoutEnding.map(i => i[1]))
      .toEqual(resultWithEnding.map(i => i[1]))
    expect(resultWithEnding).toMatchInlineSnapshot(`
      [
        [
          "	*/
      ",
          0,
        ],
        [
          "	public void setTestingRefNum(long l) {
      ",
          5,
        ],
        [
          "	testingRefNum = l;
      ",
          46,
        ],
        [
          "	}
      ",
          67,
        ],
      ]
    `)
  })
})
