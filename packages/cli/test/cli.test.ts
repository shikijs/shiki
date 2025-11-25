import fs from 'node:fs/promises'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getExtFromUrl, isUrl, readSource, run } from '../src/cli'

describe('isUrl', () => {
  it('http', () => {
    expect(isUrl('http://example.com/file.ts')).toBe(true)
    expect(isUrl('http://localhost:3000/code.js')).toBe(true)
  })

  it('https', () => {
    expect(isUrl('https://example.com/file.ts')).toBe(true)
    expect(isUrl('https://raw.githubusercontent.com/org/repo/main/file.ts')).toBe(true)
  })

  it('local paths', () => {
    expect(isUrl('./file.ts')).toBe(false)
    expect(isUrl('/absolute/path/file.ts')).toBe(false)
    expect(isUrl('relative/path/file.ts')).toBe(false)
    expect(isUrl('file.ts')).toBe(false)
  })
})

describe('getExtFromUrl', () => {
  it('extracts extension', () => {
    expect(getExtFromUrl('https://example.com/file.ts')).toBe('ts')
    expect(getExtFromUrl('https://example.com/path/to/file.js')).toBe('js')
    expect(getExtFromUrl('https://raw.githubusercontent.com/org/repo/main/config.json')).toBe('json')
  })

  it('handles query params', () => {
    expect(getExtFromUrl('https://example.com/file.ts?token=abc')).toBe('ts')
  })

  it('no extension', () => {
    expect(getExtFromUrl('https://example.com/file')).toBe('')
    expect(getExtFromUrl('https://example.com/')).toBe('')
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
    await run(['node', 'shiki', '--lang', 'python', 'https://example.com/code'], msg => output.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('print')

    vi.unstubAllGlobals()
  })
})
