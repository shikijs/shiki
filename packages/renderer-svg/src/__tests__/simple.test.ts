import { getHighlighter } from 'shiki'
import { getSVGRenderer } from '../index'

test('Can convert single line code to SVG', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const svgRenderer = await getSVGRenderer({
    fontFamily: 'Courier'
  })

  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, 'js')
  const out = svgRenderer.renderToSVG(tokens)
  expect(out).toMatchSnapshot()
})

test('Can convert multi line code to SVG', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const svgRenderer = await getSVGRenderer({
    fontFamily: 'Courier'
  })

  const tokens = highlighter.codeToThemedTokens(`function go() {\n  console.log('shiki');\n}`, 'js')
  const out = svgRenderer.renderToSVG(tokens)
  expect(out).toMatchSnapshot()
})
