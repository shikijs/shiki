import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { cac } from 'cac'
import { codegen } from '.'

const cli = cac('shiki-codegen')

cli
  .command('[path]', 'Generate shiki bundle module')
  .option('--themes <themes>', 'Themes to include')
  .option('--langs <langs>', 'Languages to include')
  .option('--engine <engine>', 'Engine to use', { default: 'javascript' })
  .option('--precompiled', 'Use precompiled languages', { default: false })
  .option('--shorthands', 'Generate shorthands', { default: true })
  .option('--format', 'Use prettier to format', { default: true })
  .action(async (path, options) => {
    const output: string = resolve(path || 'shiki.bundle.ts')

    const langs = ((Array.isArray(options.langs) ? options.langs.join(',') : options.langs || '') as string)
      .split(',')
      .map(lang => lang.trim())
      .filter(Boolean)
    const themes = ((Array.isArray(options.themes) ? options.themes.join(',') : options.themes || '') as string)
      .split(',')
      .map(theme => theme.trim())
      .filter(Boolean)

    const isTypeScript = !!output.match(/\.[cm]?ts$/i)

    if (!themes.length) {
      throw new Error('No themes specified, use --themes=theme-name to specify themes')
    }
    if (!langs.length) {
      throw new Error('No langs specified, use --langs=lang-name to specify langs')
    }

    const { code } = await codegen({
      langs: langs as any[],
      themes: themes as any[],
      engine: options.engine,
      precompiled: options.precompiled,
      shorthands: options.shorthands,
      format: options.format,
      typescript: isTypeScript,
    })

    await fs.mkdir(dirname(output), { recursive: true })
    await fs.writeFile(output, code, 'utf-8')
    console.log(`Generated bundle to ${output}`)
  })

cli.help()
cli.parse()
