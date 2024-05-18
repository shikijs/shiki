/// <reference path="./global.d.ts" />

import playwright from 'playwright'

interface Measurement {
  /**
   * The width and height of the measured text
   */
  width: number
  height: number
}

function measureStr([fontSize, fontFamily]: [number, string]): Measurement {
  if (fontSize <= 0)
    fontSize = 12

  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.fontSize = `${fontSize}px`
  span.style.fontFamily = fontFamily
  span.style.display = 'inline-block'
  span.textContent = 'a'
  document.body.appendChild(span)
  const { width, height } = window.getComputedStyle(span)
  document.body.removeChild(span)
  return {
    width: Number.parseFloat(width),
    height: Number.parseFloat(height),
  }
}

function getDocument(fontName: string, url: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url(${url});
    body { font-family: '${fontName}'; }
  </style>
</head>
<body>
<p>Test</p>
</body>
</html>
`
}

/**
 * measure the width and height of char 'a' based on fontSize and fontFamily
 */
export async function measureFont(
  fontSize: number,
  fontFamily: string,
  remoteFontCSSURL: string = '',
): Promise<Measurement> {
  if (__BROWSER__) {
    return measureStr([fontSize, fontFamily])
  }
  else {
    const browser = await playwright.chromium.launch({ headless: true })
    const page = await browser.newPage()
    if (remoteFontCSSURL.length) {
      await page.goto(
        `data:text/html,${getDocument(fontFamily, remoteFontCSSURL)}`,
        {
          waitUntil: 'networkidle',
        },
      )
    }
    const measurement = await page.evaluate(measureStr, [
      fontSize,
      fontFamily,
    ] as [number, string])
    await browser.close()
    // the fontHeight measured by chrome is 1.5 times that of playwright
    measurement.height *= 1.5
    return measurement
  }
}
