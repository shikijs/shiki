import { codeToHast, codeToThemedTokens } from 'shikiji'
import { transformerTwoSlash } from 'shikiji-twoslash'
import { expect, it } from 'vitest'
import { visit } from 'unist-util-visit'
import type { Node } from 'hast'

const code = `import { ref, computed } from "vue"`

it('verify theme behavior', async () => {
  const tokens = await codeToThemedTokens(code, {
    lang: 'ts',
    theme: 'min-dark',
  })

  // `min-dark` is less fine-grained, so that the import statement is a single token
  expect.soft(tokens.find(i => i.find(j => j.content === ' { ref')))
    .toBeDefined()
  expect.soft(tokens.find(i => i.find(j => j.content === 'ref')))
    .not.toBeDefined()
})

it('should split tokens correctly', async () => {
  const hast = await codeToHast(code, {
    lang: 'ts',
    theme: 'min-dark',
    transformers: [
      transformerTwoSlash(),
    ],
  })

  let found: Node | undefined
  visit(hast, 'text', (node) => {
    if (node.value === 'ref')
      found = node
  })
  expect(found).toBeDefined()

  found = undefined
  visit(hast, 'text', (node) => {
    if (node.value === 'computed')
      found = node
  })
  expect(found).toBeDefined()
})
