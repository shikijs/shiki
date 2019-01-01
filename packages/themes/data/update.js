/**
 * Update themes from upstream sources
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

async function get(url) {
  return new Promise((r, reject) => {
    https.get(url, res => {
      const { statusCode } = res
      if (statusCode !== 200) {
        reject('request failed')
      }

      res.setEncoding('utf-8')
      let rawData = ''
      res.on('data', chunk => (rawData += chunk))
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          r(JSON.stringify(parsedData, null, 2))
        } catch (e) {
          reject('parse failed')
        }
      })
    }).on('error', e => {
      reject('get failed')
    })
  })
}

async function download(t) {
  const p = path.join(__dirname, t.p)
  const c = await get(t.r)
  fs.writeFileSync(p, c)
}

/**
 * Nice
 * 
 * - Nord
 * - Min
 * - White
 */

const themes = [
  {
    p: './nice/nord.json',
    r: 'https://raw.githubusercontent.com/arcticicestudio/nord-visual-studio-code/develop/themes/nord.json'
  },
  {
    p: './nice/min-light.json',
    r: 'https://raw.githubusercontent.com/misolori/min-theme/master/themes/min-light.json'
  },
  {
    p: './nice/min-dark.json',
    r: 'https://raw.githubusercontent.com/misolori/min-theme/master/themes/min-dark.json'
  },
  {
    p: './nice/white.json',
    r: 'https://raw.githubusercontent.com/arthurwhite/white-theme-vscode/master/themes/White-color-theme.json'
  },
  {
    p: './nice/white-night.json',
    r: 'https://raw.githubusercontent.com/arthurwhite/white-theme-vscode/master/themes/White-Night-color-theme.json'
  }
]

Promise.all(themes.map(download)).then(() => {
  console.log('done')
})

/**
 * Manual
 */

// Zeit - http://zeit-theme.now.sh
// Material
//   - move theme files from ~/.vscode/extensions to ./data/material
//   - node ./material.js