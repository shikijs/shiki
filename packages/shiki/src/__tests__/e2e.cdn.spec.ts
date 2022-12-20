// @ts-check
import { chromium, test, expect } from '@playwright/test'

const CDN_CONFIGURATIONS = [
  { name: 'jsDelivr', url: 'https://cdn.jsdelivr.net/npm/shiki' },
  { name: 'unpkg', url: 'https://unpkg.com/shiki' }
]

test.describe('CDN bundle', () => {
  for (const cdnConfig of CDN_CONFIGURATIONS) {
    test(`for ${cdnConfig.name} loads embedded languages and renders code block`, async ({
      baseURL
    }) => {
      const browser = await chromium.launch()
      const page = await browser.newPage()

      let countLanguageRequests = 0

      await page.route('**', async route => {
        const request = route.request()

        let requestURL = request.url()

        // Checking if all requests go to the CDN
        if (!requestURL.endsWith('.html')) {
          expect(requestURL).toContain(cdnConfig.url)
          requestURL = normalizeURL(requestURL, cdnConfig.url, baseURL)

          // Counting language requests
          if (requestURL.endsWith('tmLanguage.json')) countLanguageRequests++
        }

        const response = await page.request.fetch(requestURL)

        route.fulfill({
          response
        })
      })

      await page.goto(`/index_${cdnConfig.name.toLowerCase()}.html`)

      const codeLocator = await page.getByRole('code')

      await expect(codeLocator).toBeVisible()

      expect(countLanguageRequests).toBeGreaterThan(1)

      await browser.close()
    })
  }
})

function normalizeURL(remoteUrl, cdnUrl, baseUrl) {
  // If it's not the base CDN call we're removing the version number
  // and modify the request to serve from localhost
  if (remoteUrl !== cdnUrl) {
    return remoteUrl
      .replace(cdnUrl, baseUrl)
      .replace(/@[0-9]\.[0-9][0-9]?\.[0-9][0-9]?(\.[0-9][0-9])?/, '')
  }
  return remoteUrl
}
