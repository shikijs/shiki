import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const distFile = join(import.meta.dirname, '../dist/solid.mjs')

describe('published solid stream renderer', () => {
  it('does not compile JSX as React.createElement', async () => {
    const code = await readFile(distFile, 'utf8')
    expect(code).not.toContain('React.createElement')
    expect(code).not.toMatch(/\bReact\./)
    expect(code).not.toMatch(/from\s+['"]react['"]/)
    // Solid's compiler emits template helpers from solid-js/web, not a React JSX runtime.
    expect(code).toMatch(/from\s+['"]solid-js\/web['"]/)
  })
})
