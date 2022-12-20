// @ts-check
import { chromium, test, expect } from '@playwright/test'

test.describe('Browser bundle', async () => {
  test(`with default paths loads embedded languages and renders code block`, async () => {
    const browser = await chromium.launch()
    const page = await browser.newPage()

    let countLanguageRequests = 0

    page.on('response', response => {
      if (response.url().endsWith('tmLanguage.json')) countLanguageRequests++
    })

    await page.goto(`/index_browser.html`)

    const codeLocator = await page.getByRole('code')

    await expect(codeLocator).toBeVisible()

    expect(countLanguageRequests).toBeGreaterThan(1)

    await browser.close()
  })

  test(`with custom path loads embedded languages and renders code block`, async () => {
    const browser = await chromium.launch()
    const page = await browser.newPage()

    let countLanguageRequests = 0

    page.on('response', response => {
      if (response.url().endsWith('tmLanguage.json')) countLanguageRequests++
    })

    await page.goto(`/index_browser_custom_paths.html`)

    const codeLocator = await page.getByRole('code')

    await expect(codeLocator).toBeVisible()

    expect(countLanguageRequests).toBeGreaterThan(1)

    await browser.close()
  })

  test(`with custom setCDN loads embedded languages and renders code block`, async () => {
    const browser = await chromium.launch()
    const page = await browser.newPage()

    let countLanguageRequests = 0

    page.on('response', response => {
      if (response.url().endsWith('tmLanguage.json')) countLanguageRequests++
    })

    await page.goto(`/index_browser_custom_cdn.html`)

    const codeLocator = await page.getByRole('code')

    await expect(codeLocator).toBeVisible()

    expect(countLanguageRequests).toBeGreaterThan(1)

    await browser.close()
  })

  test(`with custom setWasm loads embedded languages and renders code block`, async () => {
    const browser = await chromium.launch()
    const page = await browser.newPage()

    let countLanguageRequests = 0

    page.on('response', response => {
      if (response.url().endsWith('tmLanguage.json')) countLanguageRequests++
    })

    await page.goto(`/index_browser_custom_wasm.html`)

    const codeLocator = await page.getByRole('code')

    await expect(codeLocator).toBeVisible()

    expect(countLanguageRequests).toBeGreaterThan(1)

    await browser.close()
  })
})
