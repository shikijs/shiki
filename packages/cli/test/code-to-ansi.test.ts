import { afterEach, describe, expect, it, vi } from 'vitest'

const ESCAPE = '\u001B'
const ANSI_PREFIX = `${ESCAPE}[`
const TRUECOLOR_FOREGROUND = `${ESCAPE}[38;2;`
const ANSI256_FOREGROUND = `${ESCAPE}[38;5;`

/**
 * `codeToANSI` must not inherit the color support that the default `ansis`
 * instance infers from the current environment: its result is not necessarily
 * printed to the terminal running this code, so a "no color" environment used
 * to silently strip all highlighting (#1274).
 *
 * The environment is set before importing the module under test, because
 * `ansis` resolves color support at import time.
 */
async function importCodeToANSI() {
  vi.resetModules()
  return await import('../src/code-to-ansi')
}

describe('codeToANSI', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('emits truecolor escape codes when the environment disables color', async () => {
    vi.stubEnv('NO_COLOR', '1')
    vi.stubEnv('FORCE_COLOR', undefined)

    const { codeToANSI } = await importCodeToANSI()
    const output = await codeToANSI('# hi', 'markdown', 'github-dark-default')

    expect(output).toContain(ANSI_PREFIX)
    expect(output).toContain(TRUECOLOR_FOREGROUND)
    expect(output).toContain('# hi')
  })

  it('emits plain text when the caller asks for no color', async () => {
    vi.stubEnv('NO_COLOR', '1')
    vi.stubEnv('FORCE_COLOR', undefined)

    const { codeToANSI } = await importCodeToANSI()
    const output = await codeToANSI('# hi', 'markdown', 'github-dark-default', { colorLevel: 0 })

    expect(output).not.toContain(ANSI_PREFIX)
    expect(output).toContain('# hi')
  })

  it('honors an explicit lower color level', async () => {
    vi.stubEnv('NO_COLOR', '1')
    vi.stubEnv('FORCE_COLOR', undefined)

    const { codeToANSI } = await importCodeToANSI()
    const output = await codeToANSI('# hi', 'markdown', 'github-dark-default', { colorLevel: 2 })

    expect(output).toContain(ANSI256_FOREGROUND)
    expect(output).not.toContain(TRUECOLOR_FOREGROUND)
  })
})
