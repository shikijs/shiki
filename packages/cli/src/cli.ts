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
    .option('-o, --output <file>', 'Write output to file instead of stdout')
    .help()
    .version(version)

  const { options, args } = cli.parse(argv)
  const files = args

  if (files.length === 0) {
    cli.outputHelp()
    process.exit(1)
  }

  let codes: string[] = []
  let hadError = false

  for (const path of files) {
    try {
      await fs.access(path)
    } catch (err) {
      log(`Error: File not found or inaccessible: ${path}`)
      hadError = true
      continue
    }
    let content: string
    try {
      content = await fs.readFile(path, 'utf-8')
    } catch (err) {
      log(`Error: Failed to read file: ${path}`)
      hadError = true
      continue
    }
    const ext = options.lang || parse(path).ext.slice(1)
    let ansi: string
    try {
      ansi = await codeToANSI(content, ext, options.theme)
    } catch (err) {
      log(`Error: Failed to highlight file '${path}' with lang='${ext}' and theme='${options.theme}'.`)
      hadError = true
      continue
    }
    codes.push(ansi)
  }

  if (codes.length === 0) {
    log('No files were successfully processed.')
    process.exit(2)
  }

  const output = codes.join('\n')

  if (options.output) {
    try {
      await fs.writeFile(options.output, output, 'utf-8')
    } catch (err) {
      log(`Error: Failed to write output file: ${options.output}`)
      process.exit(3)
    }
  } else {
    for (const code of codes)
      log(code)
  }

  if (hadError) {
    process.exit(4)
  }
}

run()
