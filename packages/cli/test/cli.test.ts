import fs from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getExtFromUrl, isUrl, readSource, resolveLanguage, run } from '../src/cli'

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

describe('resolveLanguage', () => {
  it('keeps bundled languages and aliases', () => {
    expect(resolveLanguage('ts')).toBe('ts')
    expect(resolveLanguage('typescript')).toBe('typescript')
    expect(resolveLanguage('md')).toBe('md')
    expect(resolveLanguage('dotenv')).toBe('dotenv')
  })

  it('keeps special languages', () => {
    expect(resolveLanguage('text')).toBe('text')
    expect(resolveLanguage('txt')).toBe('txt')
    expect(resolveLanguage('plain')).toBe('plain')
    expect(resolveLanguage('ansi')).toBe('ansi')
  })

  it('falls back to text for unknown languages', () => {
    expect(resolveLanguage('example')).toBe('text')
    expect(resolveLanguage('env.example')).toBe('text')
  })

  it('normalizes casing before lookup', () => {
    expect(resolveLanguage('TS')).toBe('ts')
    expect(resolveLanguage('DOTENV')).toBe('dotenv')
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

    const asHtml: string[] = []
    const plain: string[] = []
    await run(['node', 'shiki', '--format', 'html', noExtFile], msg => asHtml.push(msg))
    await run(['node', 'shiki', '--lang', 'text', '--format', 'html', noExtFile], msg => plain.push(msg))
    expect(asHtml[0]).toBe(plain[0])
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

  it('unknown extension falls back to plaintext without throwing', async () => {
    const envFile = path.join(testDir, '.env.example')
    await fs.writeFile(envFile, 'FOO=bar')

    const output: string[] = []
    await run(['node', 'shiki', '--format', 'html', envFile], msg => output.push(msg))

    const plain: string[] = []
    await run(['node', 'shiki', '--lang', 'text', '--format', 'html', envFile], msg => plain.push(msg))

    expect(output.length).toBe(1)
    expect(output[0]).toContain('FOO=bar')
    expect(output[0]).toBe(plain[0])
  })

  it('highlights known extensions', async () => {
    const mdFile = path.join(testDir, 'README.md')
    await fs.writeFile(mdFile, '# Title')

    const md: string[] = []
    const mdPlain: string[] = []
    await run(['node', 'shiki', '--format', 'html', mdFile], msg => md.push(msg))
    await run(['node', 'shiki', '--lang', 'text', '--format', 'html', mdFile], msg => mdPlain.push(msg))
    expect(md[0]).toContain('Title')
    expect(md[0]).not.toBe(mdPlain[0])

    const ts: string[] = []
    const tsPlain: string[] = []
    await run(['node', 'shiki', '--format', 'html', testFile], msg => ts.push(msg))
    await run(['node', 'shiki', '--lang', 'text', '--format', 'html', testFile], msg => tsPlain.push(msg))
    expect(ts[0]).toContain('const')
    expect(ts[0]).not.toBe(tsPlain[0])
  })

  it('respects explicit --lang over unknown extension', async () => {
    const envFile = path.join(testDir, 'file.env.example')
    await fs.writeFile(envFile, 'FOO=bar')

    const explicit: string[] = []
    const fallback: string[] = []
    await run(['node', 'shiki', '--lang', 'dotenv', '--format', 'html', envFile], msg => explicit.push(msg))
    await run(['node', 'shiki', '--format', 'html', envFile], msg => fallback.push(msg))

    expect(explicit.length).toBe(1)
    expect(explicit[0]).toContain('FOO')
    expect(explicit[0]).not.toBe(fallback[0])
  })

  it('stdin without --lang uses text', async () => {
    function createStdin() {
      const stdin = Readable.from(['const x = 1']) as Readable & { isTTY?: boolean }
      stdin.isTTY = false
      return stdin
    }

    const output: string[] = []
    await run(['node', 'shiki', '--format', 'html'], msg => output.push(msg), createStdin())

    const plain: string[] = []
    await run(['node', 'shiki', '--lang', 'text', '--format', 'html'], msg => plain.push(msg), createStdin())

    const asTs: string[] = []
    await run(['node', 'shiki', '--lang', 'ts', '--format', 'html'], msg => asTs.push(msg), createStdin())

    expect(output.length).toBe(1)
    expect(output[0]).toContain('const x = 1')
    expect(output[0]).toBe(plain[0])
    expect(output[0]).not.toBe(asTs[0])
  })
})
