import type { Readable } from 'node:stream'
import type { BundledLanguage, BundledTheme } from 'shiki'
import fs from 'node:fs/promises'
import { parse } from 'node:path'
import process from 'node:process'
import cac from 'cac'
import { bundledLanguages, isSpecialLang } from 'shiki'
import { version } from '../package.json'
import { codeToANSI } from './code-to-ansi'

export function isUrl(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://')
}

export function getExtFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    return parse(pathname).ext.slice(1).toLowerCase()
  }
  catch {
    return ''
  }
}

/**
 * Unknown languages fall back to plaintext so the CLI can be used as a `cat` replacement.
 * Known-language grammar load/parse errors are not swallowed.
 */
export function resolveLanguage(lang: string): string {
  const normalized = lang.toLowerCase()
  if (normalized in bundledLanguages || isSpecialLang(normalized))
    return normalized
  return 'text'
}

async function render(
  content: string,
  lang: string,
  theme: BundledTheme,
  format: string,
): Promise<string> {
  const resolved = resolveLanguage(lang) as BundledLanguage
  if (format === 'html') {
    const { codeToHtml } = await import('shiki')
    return await codeToHtml(content, {
      lang: resolved,
      theme,
    })
  }
  return await codeToANSI(content, resolved, theme)
}

export async function readSource(path: string): Promise<{ content: string, ext: string }> {
  if (isUrl(path)) {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`)
    }
    const content = await response.text()
    const ext = getExtFromUrl(path)
    return { content, ext }
  }
  else {
    const content = await fs.readFile(path, 'utf-8')
    const ext = parse(path).ext.slice(1).toLowerCase()
    return { content, ext }
  }
}

export async function run(
  argv = process.argv,
  log = console.log,
  stdin: Readable & { isTTY?: boolean } = process.stdin,
): Promise<void> {
  const cli = cac('shiki')

  cli
    .option('--theme <theme>', 'Color theme to use', { default: 'vitesse-dark' })
    .option('--lang <lang>', 'Programming language')
    .option('--format <format>', 'Output format (ansi, html)', { default: 'ansi' })
    .option('--list-themes', 'List all available themes')
    .option('--list-langs', 'List all available languages')
    .help()
    .version(version)

  const { options, args } = cli.parse(argv)

  if (options.listThemes) {
    const { bundledThemes } = await import('shiki')
    for (const theme of Object.keys(bundledThemes))
      log(theme)
    return
  }

  if (options.listLangs) {
    for (const lang of Object.keys(bundledLanguages))
      log(lang)
    return
  }

  const files = args

  if (files.length === 0) {
    // If no files provided, verify if we are in a TTY environment
    // If NOT in TTY (piped), read from stdin
    // If in TTY, show help
    if (!stdin.isTTY) {
      const content = await new Promise<string>((resolve, reject) => {
        let data = ''
        stdin.on('data', chunk => data += chunk)
        stdin.on('end', () => resolve(data))
        stdin.on('error', reject)
      })

      log(await render(content, options.lang || 'text', options.theme, options.format))
      return
    }

    cli.outputHelp()
    return
  }

  const codes = await Promise.all(files.map(async (path) => {
    const { content, ext } = await readSource(path)
    const lang = options.lang || ext || 'text'
    return await render(content, lang, options.theme, options.format)
  }))

  for (const code of codes)
    log(code)
}

run()
