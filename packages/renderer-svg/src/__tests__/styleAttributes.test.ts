import { getSVGRenderer } from '../index'

test('SVG renderer should generate SVG with correct style attributes', async () => {
  const r = getSVGRenderer({
    fontFamily: 'IBM Plex Mono'
  })

  const out = (await r).renderToSVG([[{ content: 'foo', color: '#aabbccff' }]])
  // 0x40 = 64, 0xff = 256. 64/256 = 0.25

  expect(out).toContain('opacity="1"')
  expect(out).toContain('font-family="IBM Plex Mono"')
  // expect(out).toMatchSnapshot()
})

test('SVG can have 0 corner radius', async () => {
  const r = getSVGRenderer({
    fontFamily: 'IBM Plex Mono',
    bgCornerRadius: 0
  })

  const out = (await r).renderToSVG([[{ content: 'foo', color: '#aabbccff' }]])
  expect(out).toContain('rx="0"')
  // expect(out).toMatchSnapshot()
})

test(`SVG renderer should default to minimal background width correctly`, async () => {
  const r = getSVGRenderer({
    fontFamily: 'IBM Plex Mono',
    bgMinWidth: 180
  })

  const out = (await r).renderToSVG([[{ content: 'foo', color: '#aabbccff' }]])
  expect(out).toContain(`<svg viewBox="0 0 180 `)
  // expect(out).toMatchSnapshot()
})

test(`SVG renderer should ignore minimal background width when it's own boundaries are above that`, async () => {
  const r = getSVGRenderer({
    fontFamily: 'IBM Plex Mono',
    bgMinWidth: 150
  })

  const out = (await r).renderToSVG([[{ content: 'foo', color: '#aabbccff' }]])
  expect(out).not.toContain(`<svg viewBox="0 0 150 `)
})
