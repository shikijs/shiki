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
    console.error(`Failed to download ${type} from ${url}: ${e.step} - ${e.message}`)
    return {
      ...e,
      success: false,
      type,
      url
    }
  }

  const contentObj = processor(content)

  fs.writeFileSync(outPath, JSON.stringify(contentObj, null, 2))
  console.log(`Downloaded ${type}: ${chalk.blue(outPath)}`)
  return { success: true }
}
