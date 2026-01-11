import { codeToHtml } from 'shiki/bundle/full'
import { describe, expect, it } from 'vitest'

const code = `const a = 1`

describe('decorations intersections', () => {
  it('should not throw when checkIntersections is false', async () => {
    await expect(codeToHtml(code, {
      theme: 'vitesse-light',
      lang: 'ts',
      decorations: [
        { start: 0, end: 10 },
        { start: 1, end: 11 },
      ],
      checkIntersections: false,
    })).resolves.not.toThrow()
  })
})
