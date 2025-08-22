import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import MagicString from 'magic-string'

export class FilePatcher {
  private files = new Map<string, { content: string, patches: Map<string, string> } | null>()

  static key(from: number, to?: number): string {
    return `${from}${to ? `:${to}` : ''}`
  }

  load(path: string): { content: string, patches: Map<string, string> } | null {
    let file = this.files.get(path)
    if (file === undefined) {
      if (existsSync(path)) {
        const content = readFileSync(path, { encoding: 'utf-8' })
        file = { content, patches: new Map() }
      }
      else {
        file = null
      }
      this.files.set(path, file)
    }
    return file
  }

  patch(path: string): void {
    const file = this.files.get(path)
    if (file) {
      if (file.patches.size) {
        const s = new MagicString(file.content)

        // apply patches
        for (const [key, value] of file.patches) {
          const [from, to] = key.split(':').map(s => s !== '' ? Number(s) : undefined)
          if (from === undefined)
            continue

          if (to !== undefined) {
            s.update(from, to, value)
          }
          else {
            s.appendRight(from, value)
          }
        }

        // write the patched content back to the file
        const content = s.toString()
        writeFileSync(path, content, { encoding: 'utf-8' })
      }
      this.files.delete(path)
    }
  }
}
