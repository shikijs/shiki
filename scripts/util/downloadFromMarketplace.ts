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

  const zip = fs.createReadStream(zipPath).pipe(unzipper.Parse({ forceStream: true }))

  for await (const entry of zip) {
    const match = fPaths.filter(([_name, fPath]) => {
      return entry.path === fPath
    })

    if (match.length > 0) {
      const fName = typeof match[0] === 'string' ? entry.path.split('/').pop() : match[0][0]

      entry.pipe(fs.createWriteStream(`tmp/${type}s/${fName}`))
      console.log(`${chalk.red('extracted')} ${chalk.blue(fName)} from ${chalk.yellow(extFullId)}`)
    } else {
      entry.autodrain()
    }
  }
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
