import { writeFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { codeToTokens } from 'shiki'
import { getSVGRenderer } from '../src/index'

globalThis.__BROWSER__ = false

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
  writeFileSync(new URL('./uiviewer/test.html', import.meta.url), htmlfile)
}

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
  const { tokens } = await codeToTokens(str.trim(), {
    lang: 'javascript',
    theme: 'github-light',
  })

  it('renderToSVG', async () => {
    const { renderToSVG } = await getSVGRenderer({
      fontSize: 20,
    })
    const res = await renderToSVG(tokens)
    expect(res).toContain('</text>')
    expect(res).toContain('</tspan>')
    expect(res).toContain('<svg')

    // for ui test
    writeHTMLFile(res)
  })
})
