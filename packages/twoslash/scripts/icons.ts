import type { CompletionEntry } from 'typescript'
import fs from 'node:fs/promises'
import { icons as carbon } from '@iconify-json/carbon'
import { icons as codicon } from '@iconify-json/codicon'
import { fromHtml } from 'hast-util-from-html'

async function buildIcons(filepath: string, map: Record<string, string>): Promise<void> {
  const result = Object.fromEntries(
    Object.entries(map).map(([key, value]) => {
      const iconset = value.startsWith('codicon:') ? codicon : carbon
      const icon = iconset.icons[value.split(':')[1]]
      if (!icon)
        throw new Error(`Icon not found: ${value}`)
      const str = `<svg viewBox="0 0 ${carbon.height} ${carbon.height}">${icon.body}</svg>`
      const hast = fromHtml(str, { space: 'svg', fragment: true }).children[0]
      return [key, hast]
    }),
  )

  await fs.writeFile(
    filepath,
    `${JSON.stringify(result, (r, v) => {
      if (v?.position)
        delete v.position
      return v
    }, 2)}\n`,
    'utf-8',
  )
}

await buildIcons(
  './src/icons-completions.json',
  {
    module: 'carbon:3d-mpr-toggle',
    class: 'carbon:data-class',
    method: 'carbon:function',
    property: 'carbon:tools',
    constructor: 'carbon:3d-software',
    interface: 'carbon:connect',
    function: 'carbon:function',
    string: 'carbon:string-text',
  } satisfies Partial<Record<CompletionEntry['kind'], string>>,
)

await buildIcons(
  './src/icons-tags.json',
  {
    log: 'carbon:information-square',
    error: 'carbon:warning',
    warn: 'carbon:warning-alt',
    annotate: 'carbon:idea',
  },
)
