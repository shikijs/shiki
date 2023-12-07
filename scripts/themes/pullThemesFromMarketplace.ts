import { marketplaceThemeSources } from '../themeSources'
import { downloadFromMarketplace } from '../util/downloadFromMarketplace'

go()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

async function go() {
  for (const [extFullId, themes] of Object.entries(marketplaceThemeSources)) {
    await downloadFromMarketplace(extFullId, themes, 'theme')
  }
}
