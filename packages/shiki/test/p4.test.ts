import { expect, it } from 'vitest'
import { codeToHtml } from '../src'

it('p4', async () => {
  const code = `
#include <core.p4>

register<bit<32>, bit<1>>(8) statistical_data;

action drop() {
    mark_to_drop(standard_metadata);
}

table ipv4_lpm {
    key = {
        hdr.ipv4.dstAddr: lpm;
    }
    actions = {
        ipv4_forward;
        drop;
        NoAction;
    }
    size = 1024;
    default_action = NoAction();
}
`

  const html = await codeToHtml(code, {
    lang: 'p4',
    theme: 'vitesse-dark',
  })

  await expect(html).toMatchFileSnapshot('./out/p4.html')
})
