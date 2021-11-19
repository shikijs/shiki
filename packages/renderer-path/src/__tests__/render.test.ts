import path from 'path'
import fs from 'fs'
import type { IThemedToken } from 'shiki'
import { getPathRenderer } from '../index'

describe('Path Renderer', () => {
  const tokens: IThemedToken[][] = [
    [
      {
        content: 'const',
        color: '#81A1C1',
        fontStyle: 0
      },
      {
        content: ' ',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: 'fs',
        color: '#D8DEE9',
        fontStyle: 0
      },
      {
        content: ' ',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: '=',
        color: '#81A1C1',
        fontStyle: 0
      },
      {
        content: ' ',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: 'require',
        color: '#88C0D0',
        fontStyle: 0
      },
      {
        content: '(',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: "'",
        color: '#ECEFF4',
        fontStyle: 0
      },
      {
        content: 'fs',
        color: '#A3BE8C',
        fontStyle: 0
      },
      {
        content: "'",
        color: '#ECEFF4',
        fontStyle: 0
      },
      {
        content: ')',
        color: '#D8DEE9FF',
        fontStyle: 0
      }
    ],
    [
      {
        content: 'const',
        color: '#81A1C1',
        fontStyle: 0
      },
      {
        content: ' ',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: 'shiki',
        color: '#D8DEE9',
        fontStyle: 0
      },
      {
        content: ' ',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: '=',
        color: '#81A1C1',
        fontStyle: 0
      },
      {
        content: ' ',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: 'require',
        color: '#88C0D0',
        fontStyle: 0
      },
      {
        content: '(',
        color: '#D8DEE9FF',
        fontStyle: 0
      },
      {
        content: "'",
        color: '#ECEFF4',
        fontStyle: 0
      },
      {
        content: 'shiki',
        color: '#A3BE8C',
        fontStyle: 0
      },
      {
        content: "'",
        color: '#ECEFF4',
        fontStyle: 0
      },
      {
        content: ')',
        color: '#D8DEE9FF',
        fontStyle: 0
      }
    ]
  ]

  const fontFilePath = path.join(__dirname, 'Fira Code.woff')

  it.skip('should generate a svg', async () => {
    const renderer = await getPathRenderer({
      fontFile: fontFilePath,
      fontSize: 14,
      bg: '#000'
    })

    const out = renderer.renderToSVG(tokens)

    fs.writeFileSync(path.join(__dirname, 'out.svg'), out)
  })

  it('should generate same SVG with different loading font ways', async () => {
    const renderer = await getPathRenderer({
      fontFile: fontFilePath,
      fontSize: 14,
      bg: '#000'
    })

    const rendererByBuffer = await getPathRenderer({
      fontFile: fs.readFileSync(fontFilePath).buffer,
      fontSize: 14,
      bg: '#000'
    })

    const out = renderer.renderToSVG(tokens)
    const out2 = rendererByBuffer.renderToSVG(tokens)

    expect(out).toBe(out2)
  })

  it('should generate tokens to paths', async () => {
    const renderer = await getPathRenderer({
      fontFile: fontFilePath,
      fontSize: 14,
      bg: '#000'
    })

    const out = renderer.renderToSVG(tokens)

    const tokensCount = tokens.flat().length

    expect(out.match(/<path/g)).toHaveLength(tokensCount)
  })
})
