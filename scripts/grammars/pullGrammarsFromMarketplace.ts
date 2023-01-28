import { marketplaceGrammarSources } from '../grammarSources'
import { downloadFromMarketplace } from '../util/downloadFromMarketplace'

go()

async function go() {
  for (const [extFullId, langs] of Object.entries(marketplaceGrammarSources)) {
    await downloadFromMarketplace(extFullId, langs, 'grammar')
  }
}
