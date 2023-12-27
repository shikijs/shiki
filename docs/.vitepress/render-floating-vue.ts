import { rendererRich } from 'shikiji-twoslash'
import type { TwoSlashRenderers } from 'shikiji-twoslash'
import type { Element, Text } from 'hast'
import type { ShikijiTransformerContext } from 'shikiji'

const rich = rendererRich({
  classExtra: 'vp-copy-ignore',
})

function createFloatingVueWarpper(this: ShikijiTransformerContext, text: string, node: Element | Text, presisted = false): Element {
  const themedContent = (this.codeToHast(text, {
    ...this.options,
    transformers: [],
    transforms: undefined,
  }).children[0] as Element).children

  return {
    type: 'element',
    tagName: 'v-menu',
    properties: {
      'class': 'twoslash-hover',
      'popper-class': 'vp-code shiki floating-vue-twoslash vp-copy-ignore',
      'placement': 'bottom-start',
      ':arrow-padding': '8',
      ...presisted && {
        ':shown': 'true',
        ':triggers': '[]',
      },
    },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [
          node,
        ],
      },
      {
        type: 'element',
        tagName: 'vue-template',
        properties: {
          'v-slot:popper': '{}',
        },
        children: themedContent,
      },
    ],
  }
}

export const rendererFloatingVue: TwoSlashRenderers = {
  ...rich,
  nodeStaticInfo(info, node) {
    return createFloatingVueWarpper.call(this, info.text, node)
  },
  nodeQuery(query, node) {
    if (!query.text)
      return {}
    return createFloatingVueWarpper.call(this, query.text, node, true)
  },
}
