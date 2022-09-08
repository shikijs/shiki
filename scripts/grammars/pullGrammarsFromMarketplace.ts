import { marketplaceGrammarSources } from '../grammarSources'
import { downloadFromMarketplace } from '../util/downloadFromMarketplace'

go()

async function go() {
  for (let [extFullId, fPaths] of Object.entries(marketplaceGrammarSources)) {
    await downloadFromMarketplace(extFullId, fPaths, 'grammar')
  }
}
