import { get } from './download'
import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import chalk from 'chalk'
import kebab from 'lodash.kebabcase'

export async function downloadFromMarketplace(
  extFullId: string,
  langsOrThemes: string[],
  type: 'grammar' | 'theme'
) {
  const [_publisher, extId] = extFullId.split('.')
  let content
  try {
    content = await get(getMarketplaceLink(extFullId), 'binary')
  } catch (e) {
    console.log(e)
    throw Error(`Downloading extension ${extFullId} failed`)
  }

  const zipPath = `tmp/${extId}.zip`
  fs.writeFileSync(zipPath, content)

  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: `tmp/${extId}` }))
    .on('close', () => {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(`tmp/${extId}/extension/package.json`, 'utf-8')
        )
        for (let id of langsOrThemes) {
          const contributesList =
            type === 'grammar' ? packageJson.contributes.grammars : packageJson.contributes.themes
          const fileSuffix = type === 'grammar' ? '.tmLanguage.json' : '.json'

          const itemPath =
            type === 'theme'
              ? contributesList.find(c => c.label === id).path
              : contributesList.find(c => {
                  /**
                   * Certain languages, for example `mermaid`, registers two languages for the same identifier
                   *
                   * {
                   *   "grammars": [
                   *     {
                   *       "language": "mermaid",
                   *       "scopeName": "markdown.mermaid.codeblock",
                   *       "path": "./out/mermaid.tmLanguage-markdown.json"
                   *     },
                   *     {
                   *       "language": "mermaid",
                   *       "scopeName": "source.mermaid",
                   *       "path": "./out/mermaid.tmLanguage.json"
                   *     }
                   *   ]
                   * }
                   *
                   * In such case, look for the one with scopeName beginning with `source` or `text` as the canonical one
                   */
                  return (
                    c.language === id &&
                    (c.scopeName.startsWith('source') || c.scopeName.startsWith('text'))
                  )
                }).path

          fs.copyFileSync(
            path.resolve(`tmp/${extId}/extension`, itemPath),
            `tmp/${type}s/${kebab(id.toLowerCase())}${fileSuffix}`
          )

          console.log(
            `${chalk.red('extracted')} ${type}: ${chalk.blue(id)} from ${chalk.yellow(extFullId)}`
          )
        }
      } catch (err) {
        throw Error(`Error extracting from extension ${extFullId}`)
      }
    })
}

function getMarketplaceLink(publisherDotExtId: string) {
  const [publisher, extId] = publisherDotExtId.split('.')

  return (
    `https://${publisher}.gallery.vsassets.io` +
    `/_apis/public/gallery/publisher/${publisher}` +
    `/extension/${extId}/latest` +
    `/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`
  )
}
