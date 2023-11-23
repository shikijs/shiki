import fs from 'fs-extra'

function replaceMarker(code: string, marker: string, content: string) {
  const start = `<!--${marker}:start-->`
  const end = `<!--${marker}:end-->`
  const regex = new RegExp(`${start}([\\s\\S]*)${end}`)

  return code.replace(regex, `${start}\n${content.trim()}\n${end}`)
}

async function run() {
  let readme = await fs.readFile('README.md', 'utf8')

  const langs = await fs.readJSON('packages/shikiji/src/assets/langs.json')
  const themes = await fs.readJSON('packages/shikiji/src/assets/themes.json')

  readme = replaceMarker(
    readme,
    'all-themes',
    [
      '| ID |',
      '| --- |',
      ...themes.map(i => `| \`${i.id}\` |`),
    ].join('\n'),
  )

  readme = replaceMarker(
    readme,
    'all-languages',
    [
      '| ID | Name | Aliases |',
      '| --- | --- | --- |',
      ...langs.map(i => `| \`${i.id}\` | ${i.name || i.id} | ${i.aliases?.map(i => `\`${i}\``).join(', ') || ''} |`),
    ].join('\n'),
  )

  await fs.writeFile('README.md', readme, 'utf-8')
}

run()
