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
    return parse(pathname).ext.slice(1)
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
    const ext = parse(path).ext.slice(1)
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
    .help()
    .version(version)

  const { options, args } = cli.parse(argv)
  const files = args

  const codes = await Promise.all(files.map(async (path) => {
    const { content, ext } = await readSource(path)
    const lang = options.lang || ext
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

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
