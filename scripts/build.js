const fs = require('fs-extra')

async function start() {
  await fs.copy('./packages/languages/data', './packages/shiki/languages')
  await fs.copy('./packages/themes/data', './packages/shiki/themes')
}

start()
