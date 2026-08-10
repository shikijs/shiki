import fs from 'node:fs/promises'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getExtFromUrl, isUrl, readSource, run } from '../src/cli'

describe('isUrl', () => {
  it('valid URL', () => {
    expect(isUrl('http://localhost:3000/file.ts')).toBe(true)
    expect(isUrl('https://raw.githubusercontent.com/shikijs/shiki/refs/heads/main/taze.config.ts')).toBe(true)
    expect(isUrl('/absolute/path/file.ts')).toBe(false)
    expect(isUrl('relative/path/file.ts')).toBe(false)
    expect(isUrl('file.ts')).toBe(false)
  })
})

describe('getExtFromUrl', () => {
  it('extracts extension', () => {
    expect(getExtFromUrl('https://example.com/file.ts')).toBe('ts')
    expect(getExtFromUrl('https://shiki.style/guide.html')).toBe('html')
  })

  it('handles query params', () => {
    expect(getExtFromUrl('https://github.com/shikijs/shiki/blob/main/taze.config.ts?raw=true')).toBe('ts')
  })

  it('normalizes extension casing', () => {
    expect(getExtFromUrl('https://example.com/FILE.TS')).toBe('ts')
  })

  it('invalid URL', () => {
    expect(getExtFromUrl('not-a-url')).toBe('')
  })
})

describe('readSource', () => {
  const testDir = path.join(import.meta.dirname, '__fixtures__')
  const testFile = path.join(testDir, 'test.ts')
  const testContent = 'const x: number = 1'

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true })
    await fs.writeFile(testFile, testContent)
  })

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true })
  })

  it('local file', async () => {
    const result = await readSource(testFile)
    expect(result.content).toBe(testContent)
    expect(result.ext).toBe('ts')
  })

  it('local file with uppercase extension', async () => {
    const upperFile = path.join(testDir, 'UPPER.TS')
    await fs.writeFile(upperFile, testContent)

    const result = await readSource(upperFile)
    expect(result.content).toBe(testContent)
    expect(result.ext).toBe('ts')
  })

  it('remote URL', async () => {
    const mockContent = 'export const foo = "bar"'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockContent),
    }))

    const result = await readSource('https://example.com/file.js')
    expect(result.content).toBe(mockContent)
    expect(result.ext).toBe('js')

    vi.unstubAllGlobals()
  })

  it('failed fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }))

    await expect(readSource('https://example.com/missing.js'))
      .rejects
      .toThrowError('Failed to fetch https://example.com/missing.js: 404 Not Found')

    vi.unstubAllGlobals()
  })
})

describe('run', () => {
  const testDir = path.join(import.meta.dirname, '__fixtures__')
  const testFile = path.join(testDir, 'sample.ts')

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true })
    await fs.writeFile(testFile, 'const x = 1')
  })

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true })
  })

  it('local file', async () => {
    const output: string[] = []
    await run(['node', 'shiki', testFile], msg => output.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('const')
  })

  it('remote URL', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('const y = 2'),
    }))

    const output: string[] = []
    await run(['node', 'shiki', 'https://example.com/code.ts'], msg => output.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('const')

    vi.unstubAllGlobals()
  })

  it('--lang option', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('print("hello")'),
    }))

    const output: string[] = []
    await run(['node', 'shiki', '--lang', 'PYTHON', 'https://example.com/code'], msg => output.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('print')

    vi.unstubAllGlobals()
  })

  it('--format html option', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('console.log("hello")'),
    }))

    const output: string[] = []
    await run(['node', 'shiki', '--format', 'html', 'https://example.com/code.js'], msg => output.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('<pre class="shiki')
    expect(output[0]).toContain('console')

    vi.unstubAllGlobals()
  })

  it('--list-themes', async () => {
    const output: string[] = []
    await run(['node', 'shiki', '--list-themes'], msg => output.push(msg))

    expect(output.length).toBeGreaterThan(0)
    expect(output).toContain('vitesse-dark')
    expect(output).toContain('nord')
  })

  it('--list-langs', async () => {
    const output: string[] = []
    await run(['node', 'shiki', '--list-langs'], msg => output.push(msg))

    expect(output.length).toBeGreaterThan(0)
    expect(output).toContain('javascript')
    expect(output).toContain('python')
  })
  it('local file without extension falls back to plaintext', async () => {
    const noExtFile = path.join(testDir, 'Makefile')
    await fs.writeFile(noExtFile, 'all:\n\techo Hello')

    const output: string[] = []
    // should not throw; without the fix, lang='' caused shiki to error
    await run(['node', 'shiki', noExtFile], msg => output.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('all')
  })

  it('remote URL without file extension falls back to plaintext', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('FROM node:18'),
    }))

    const output: string[] = []
    // URL has no extension → ext='', lang must fall back to 'text'
    await run(['node', 'shiki', 'https://raw.githubusercontent.com/user/repo/main/Dockerfile'], msg => output.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('FROM')

    vi.unstubAllGlobals()
  })
})
