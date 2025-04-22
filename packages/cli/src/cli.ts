import type { BundledLanguage } from 'shiki'
import fs from 'node:fs/promises'
import { parse } from 'node:path'
import process from 'node:process'
import cac from 'cac'
import { version } from '../package.json'
import { codeToANSI } from './code-to-ansi'

export async function run(
  argv = process.argv,
  log = console.log,
): Promise<void> {
  const cli = cac('shiki')

  cli
    .option('--theme <theme>', 'Color theme to use', { default: 'vitesse-dark' })
    .option('--lang <lang>', 'Programming language')
    .help()
    .version(version)

  const { options, args } = cli.parse(argv)
  const files = args

  const codes = await Promise.all(files.map(async (path) => {
    const content = await fs.readFile(path, 'utf-8')
    const ext = options.lang || parse(path).ext.slice(1)
    return await codeToANSI(content, ext as BundledLanguage, options.theme)
  }))

  for (const code of codes)
    log(code)
}

run()
