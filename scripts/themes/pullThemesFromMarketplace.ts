import { marketplaceThemeSources } from '../themeSources'
import { downloadFromMarketplace } from '../util/downloadFromMarketplace'

go()

async function go() {
  for (const [extFullId, themes] of Object.entries(marketplaceThemeSources)) {
    await downloadFromMarketplace(extFullId, themes, 'theme')
  }
}
