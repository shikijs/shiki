import type Markdown from 'markdown-it'
import { Buffer } from 'node:buffer'

const FENCE_PATH_PREFIX = '__PATH'
const FENCE_PATH_PREFIX_REGEX = /\b__PATH:(\d+):(.*)$/

export function twoslashFencePathMdPlugin(md: Markdown): void {
  const fenceRule = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, _, env] = args
    const token = tokens[idx]

    // TODO: need to check is twoslash?
    const filePath = env.path
    if (filePath && !token.info.includes(FENCE_PATH_PREFIX)) {
      token.info = `${token.info} ${generateHeader(filePath)}`
    }

    return fenceRule(...args)
  }
}

function base64Encode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64')
}

function base64Decode(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8')
}

// TODO: if the header contains "twoslash" will cause error
function generateHeader(filePath: string): string {
  filePath = base64Encode(filePath)
  return `${FENCE_PATH_PREFIX}:${filePath.length}:${filePath}`
}

export function resolveMetaFilePath(header?: string): string | null {
  if (!header)
    return null

  try {
    const [match, size, remains] = header.match(FENCE_PATH_PREFIX_REGEX) || []
    if (match) {
      const length = Number.parseInt(size, 10)
      const data = remains.slice(0, length)
      return base64Decode(data)
    }
  }
  catch {
    // ignore
  }
  return null
}
