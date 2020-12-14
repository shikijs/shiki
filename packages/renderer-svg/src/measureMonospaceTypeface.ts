function measureFont(fontName: string, fontSize: number) {
  /**
   * Measure `M` for width
   */
  var c = document.createElement('canvas')
  var ctx = c.getContext('2d')!
  ctx.font = `${fontSize}px "${fontName}"`

  const capMMeasurement = ctx.measureText('M')

  /**
   * Measure A-Z, a-z for height
   * A - 65
   * Z - 90
   * a - 97
   * z - 122
   */
  const characters = []
  for (let i = 65; i <= 90; i++) {
    characters.push(String.fromCharCode(i))
  }
  for (let i = 97; i <= 122; i++) {
    characters.push(String.fromCharCode(i))
  }

  let highC, lowC
  let highestAscent = 0
  let lowestDescent = 0
  characters.forEach(c => {
    const m = ctx.measureText(c)
    if (m.actualBoundingBoxAscent > highestAscent) {
      highestAscent = m.actualBoundingBoxAscent
      highC = c
    }
    if (m.actualBoundingBoxDescent > lowestDescent) {
      lowestDescent = m.actualBoundingBoxDescent
      lowC = c
    }
  })

  return {
    width: capMMeasurement.width,
    height: highestAscent + lowestDescent
  }
}

export async function measureMonospaceTypeface(
  fontName: string,
  fontSize: number
): Promise<{ width: number; height: number }> {
  if (__BROWSER__) {
    return measureFont(fontName, fontSize)
  } else {
    const puppeteer = await import('puppeteer')
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const measurement = await page.evaluate(measureFont, fontName, fontSize)
    await browser.close()
    return measurement
  }
}
