import fs from 'fs'
import { convertGHURLToDownloadURL, get } from './download'
import chalk from 'chalk'

export async function downloadFromGH(
  url: string,
  type: 'grammar' | 'theme',
  processor: (content: string) => object,
  outPath: string
) {
  const targetUrl = convertGHURLToDownloadURL(url)

  let content
  try {
    content = await get(targetUrl)
  } catch (e) {
    throw Error(`Failed to download ${type} from ${url}: ${e}`)
  }

  const contentObj = processor(content)

  fs.writeFileSync(outPath, JSON.stringify(contentObj, null, 2))
  console.log(`Downloaded ${type}: ${chalk.blue(outPath)}`)
}
