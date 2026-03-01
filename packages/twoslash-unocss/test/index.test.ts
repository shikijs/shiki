import type { NodeHover } from 'twoslash-protocol'
import presetUno from '@unocss/preset-uno'
import { describe, expect, it } from 'vitest'
import { createTwoslasher } from '../src/index'

describe('twoslash-unocss', () => {
  it('should resolve a single utility class', async () => {
    const twoslasher = createTwoslasher({
      config: { presets: [presetUno()] },
    })

    const result = await twoslasher('text-red-500', 'html')

    expect(result.code).toBe('text-red-500')
    expect(result.nodes.length).toBeGreaterThan(0)
    expect(result.nodes[0].type).toBe('hover')

    const node = result.nodes[0] as NodeHover
    expect(node.target).toBe('text-red-500')
    expect(node.text).toContain('color')
    expect(node.start).toBe(0)
    expect(node.length).toBe('text-red-500'.length)
  })

  it('should resolve multiple utility classes', async () => {
    const twoslasher = createTwoslasher({
      config: { presets: [presetUno()] },
    })

    const code = 'flex mt-4 text-sm'
    const result = await twoslasher(code, 'html')

    expect(result.nodes.length).toBe(3)

    const targets = result.nodes
      .filter((n): n is NodeHover => n.type === 'hover')
      .map(n => n.target)

    expect(targets).toContain('flex')
    expect(targets).toContain('mt-4')
    expect(targets).toContain('text-sm')
  })

  it('should skip unknown classes', async () => {
    const twoslasher = createTwoslasher({
      config: { presets: [presetUno()] },
    })

    const code = 'not-a-real-class flex'
    const result = await twoslasher(code, 'html')

    const targets = result.nodes
      .filter((n): n is NodeHover => n.type === 'hover')
      .map(n => n.target)

    expect(targets).not.toContain('not-a-real-class')
    expect(targets).toContain('flex')
  })

  it('should preserve correct positions', async () => {
    const twoslasher = createTwoslasher({
      config: { presets: [presetUno()] },
    })

    const code = 'flex mt-4'
    const result = await twoslasher(code, 'html')

    const flexNode = result.nodes.find(
      (n): n is NodeHover => n.type === 'hover' && n.target === 'flex',
    )
    const mtNode = result.nodes.find(
      (n): n is NodeHover => n.type === 'hover' && n.target === 'mt-4',
    )

    expect(flexNode).toBeDefined()
    expect(flexNode!.start).toBe(0)
    expect(flexNode!.length).toBe(4)

    expect(mtNode).toBeDefined()
    expect(mtNode!.start).toBe(5)
    expect(mtNode!.length).toBe(4)
  })

  it('should handle empty input', async () => {
    const twoslasher = createTwoslasher({
      config: { presets: [presetUno()] },
    })

    const result = await twoslasher('', 'html')

    expect(result.code).toBe('')
    expect(result.nodes).toEqual([])
  })

  it('should handle multiline input', async () => {
    const twoslasher = createTwoslasher({
      config: { presets: [presetUno()] },
    })

    const code = 'flex\nmt-4'
    const result = await twoslasher(code, 'html')

    expect(result.nodes.length).toBe(2)

    const mtNode = result.nodes.find(
      (n): n is NodeHover => n.type === 'hover' && n.target === 'mt-4',
    )

    expect(mtNode).toBeDefined()
    // mt-4 starts on line 1 (0-indexed)
    expect(mtNode!.line).toBe(1)
  })
})
