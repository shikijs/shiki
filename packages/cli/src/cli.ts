import type { BundledLanguage } from 'shiki'
import fs from 'node:fs/promises'
import { parse } from 'node:path'
import process from 'node:process'
import cac from 'cac'
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
    const { bundledLanguages } = await import('shiki')
    for (const lang of Object.keys(bundledLanguages))
      log(lang)
    return
  }

  const files = args

  if (files.length === 0) {
    // If no files provided, verify if we are in a TTY environment
    // If NOT in TTY (piped), read from stdin
    // If in TTY, show help
    if (!process.stdin.isTTY) {
      const content = await new Promise<string>((resolve, reject) => {
        let data = ''
        process.stdin.on('data', chunk => data += chunk)
        process.stdin.on('end', () => resolve(data))
        process.stdin.on('error', reject)
      })

      const lang = options.lang || 'text'
      if (options.format === 'html') {
        const { codeToHtml } = await import('shiki')
        log(await codeToHtml(content, {
          lang: lang as BundledLanguage,
          theme: options.theme,
        }))
      }
      else {
        log(await codeToANSI(content, lang as BundledLanguage, options.theme))
      }
      return
    }

    cli.outputHelp()
    return
  }

  const codes = await Promise.all(files.map(async (path) => {
    const { content, ext } = await readSource(path)
    const lang = (options.lang || ext || 'text').toLowerCase()
    if (options.format === 'html') {
      const { codeToHtml } = await import('shiki')
      return await codeToHtml(content, {
        lang: lang as BundledLanguage,
        theme: options.theme,
      })
    }
    else {
      return await codeToANSI(content, lang as BundledLanguage, options.theme)
    }
  }))

  for (const code of codes)
    log(code)
}

run()
