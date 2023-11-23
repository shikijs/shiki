import fs from 'fs-extra'

function replaceMarker(code: string, marker: string, content: string) {
  const start = `<!--${marker}:start-->`
  const end = `<!--${marker}:end-->`
  const regex = new RegExp(`${start}([\\s\\S]*)${end}`)

  return code.replace(regex, `${start}\n${content.trim()}\n${end}`)
}

async function run() {
  let mdLangs = await fs.readFile('docs/languages.md', 'utf8')
  const langs = await fs.readJSON('packages/shikiji/src/assets/langs.json')
  mdLangs = replaceMarker(
    mdLangs,
    'all-languages',
    [
      '| ID | Name | Aliases |',
      '| --- | --- | --- |',
      ...langs.map(i => `| \`${i.id}\` | ${i.name || i.id} | ${i.aliases?.map(i => `\`${i}\``).join(', ') || ''} |`),
    ].join('\n'),
  )
  await fs.writeFile('docs/languages.md', mdLangs, 'utf-8')

  // ---- Themes
  let mdThemes = await fs.readFile('docs/themes.md', 'utf8')
  const themes = await fs.readJSON('packages/shikiji/src/assets/themes.json')
  mdThemes = replaceMarker(
    mdThemes,
    'all-themes',
    [
      '| ID |',
      '| --- |',
      ...themes.map(i => `| \`${i.id}\` |`),
    ].join('\n'),
  )
  await fs.writeFile('docs/themes.md', mdThemes, 'utf-8')
}

run()
