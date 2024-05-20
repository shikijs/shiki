import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { codeToTokens } from 'shiki'
import { getSVGRenderer } from '../src/index'

globalThis.__BROWSER__ = false

describe('renderToSVG', async () => {
  const str = `const show = console.log
//  注释注释
async function fact(n) {
  return n === 0 ? 1 : n * (await fact (n - 1))
}
fact(6).then(show)
const str = "12"
const str2 = '12'
fact(4).then(show)
fact(5).then(show)
fact(2).then(show)
fact(3).then(show)
fact(1).then(show)`

  const { tokens } = await codeToTokens(str, {
    lang: 'javascript',
    theme: 'github-light',
  })

  it('renderToSVG', async () => {
    const { renderToSVG } = await getSVGRenderer()
    const res = await renderToSVG(tokens)
    expect(res).toContain('</text>')
    expect(res).toContain('</tspan>')
    expect(res).toContain('<svg')
    expect(res).toContain('::selection')
    expect(res).not.toContain('border-radius')
    expect(res).not.toContain('opacity')

    // for ui test
    writeHTMLFile(res)
  })

  it('line height ratio', async () => {
    const fontSize = 20
    const { renderToSVG } = await getSVGRenderer({
      fontSize,
      lineHeightRatio: 1,
    })
    const svgHeight = (str.split('\n').length + 1) * fontSize
    const res = await renderToSVG(tokens)
    expect(res).toContain(`height="${svgHeight.toFixed(2)}"`)
  })

  it('fontSize', async () => {
    const { renderToSVG } = await getSVGRenderer({ fontSize: 16 })
    const res = await renderToSVG(tokens)
    expect(res).toContain('font-size="16px"')
  })

  it('backgroundColor', async () => {
    const { renderToSVG } = await getSVGRenderer({ backgroundColor: 'blue' })
    const res = await renderToSVG(tokens)
    expect(res).toContain('background-color:blue')
  })

  it('borderRadius', async () => {
    const { renderToSVG } = await getSVGRenderer({ borderRadius: 10 })
    const res = await renderToSVG(tokens)
    expect(res).toContain('border-radius:10')
  })

  it('opacity', async () => {
    const { renderToSVG } = await getSVGRenderer({ opacity: 0.5 })
    const res = await renderToSVG(tokens)
    expect(res).toContain('opacity:0.5')
  })

  it('cursor', async () => {
    const { renderToSVG } = await getSVGRenderer({ cursor: 'text' })
    const res = await renderToSVG(tokens)
    expect(res).toContain('cursor:text')
  })

  it('selectionColor', async () => {
    const { renderToSVG } = await getSVGRenderer({ selectionColor: 'red' })
    const res = await renderToSVG(tokens)
    expect(res).toContain('fill:red')
  })

  it('selectionbgColor', async () => {
    const { renderToSVG } = await getSVGRenderer({ selectionbgColor: 'yellow' })
    const res = await renderToSVG(tokens)
    expect(res).toContain('background-color:yellow')
  })
})

function writeHTMLFile(svgStr: string) {
  const htmlfile = `
<!DOCTYPE html>
<html>
<head>
</head>
  <body>
    ${svgStr}
  </body>
</html>
`
  // create uiviewer folder
  if (!existsSync(new URL('./uiviewer', import.meta.url)))
    mkdirSync(new URL('./uiviewer', import.meta.url))

  writeFileSync(new URL('./uiviewer/test.html', import.meta.url), htmlfile)
}
