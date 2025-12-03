import { expect, test } from 'vitest'
import { codeToHtml } from '../src'

test('p4', async () => {
  const code = `
#include <core.p4>

typedef bit<16> etherType_t;
typedef bit<48> macAddr_t;

const etherType_t TYPE_IPV4 = 16w0x0800;

header ethernet_t {
    macAddr_t   dstAddr;
    macAddr_t   srcAddr;
    etherType_t etherType;
}

struct headers {
    ethernet_t ethernet;
}

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
