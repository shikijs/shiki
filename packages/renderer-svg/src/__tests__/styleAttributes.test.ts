import { getSVGRenderer } from '../index'

test('SVG renderer should generate SVG with correct style attributes', async () => {
  const r = getSVGRenderer({
    fontFamily: 'IBM Plex Mono'
  })

  const out = (await r).renderToSVG([[{ content: 'foo', color: '#aabbccff' }]])
  // 0x40 = 64, 0xff = 256. 64/256 = 0.25
  expect(out).toContain('opacity="1"')
})

test('SVG can have 0 corner radius', async () => {
  const r = getSVGRenderer({
    fontFamily: 'IBM Plex Mono',
    bgCornerRadius: 0
  })

  const out = (await r).renderToSVG([[{ content: 'foo', color: '#aabbccff' }]])
  expect(out).toContain('rx="0"')
})
