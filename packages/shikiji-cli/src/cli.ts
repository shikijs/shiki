/* eslint-disable no-console */
import fs from 'node:fs/promises'
import { parse } from 'node:path'
import process from 'node:process'
import type { BundledLanguage } from 'shikiji'
import minimist from 'minimist'
import { codeToANSI } from './code-to-ansi'

export async function run(
  argv = process.argv.slice(2),
  log = console.log,
) {
  const options = minimist(argv)
  const {
    theme = 'vitesse-dark',
    lang = undefined,
    _: files = [],
  } = options

  const codes = await Promise.all(files.map(async (path) => {
    const content = await fs.readFile(path, 'utf-8')
    const ext = lang || parse(path).ext.slice(1)
    return await codeToANSI(content, ext as BundledLanguage, theme)
  }))

  for (const code of codes)
    log(code)
}

run()
