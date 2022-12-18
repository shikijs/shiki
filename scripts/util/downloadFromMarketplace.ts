import { get } from './download'
import fs from 'fs'
import unzipper from 'unzipper'
import chalk from 'chalk'

export async function downloadFromMarketplace(
  extFullId: string,
  fPaths: [string, string][],
  type: 'grammar' | 'theme'
) {
  const [_publisher, extId] = extFullId.split('.')
  let content
  try {
    content = await get(getMarketplaceLink(extFullId), 'binary')
  } catch (e) {
    console.log(e)
    throw Error(`Failed`)
  }

  const zipPath = `tmp/${extId}.zip`
  fs.writeFileSync(zipPath, content)

  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: `tmp/${extId}` }))
    .on('close', () => {
      fs.copyFileSync(`tmp/${extId}/${fPaths[0][1]}`, `tmp/${type}s/${fPaths[0][0]}`)
      console.log(
        `${chalk.red('extracted')} ${chalk.blue(fPaths[0])} from ${chalk.yellow(extFullId)}`
      )
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
