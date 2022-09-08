import { marketplaceThemeSources } from '../themeSources'
import { downloadFromMarketplace } from '../util/downloadFromMarketplace'

go()

async function go() {
  for (let [extFullId, fPaths] of Object.entries(marketplaceThemeSources)) {
    await downloadFromMarketplace(extFullId, fPaths, 'theme')
  }
}
