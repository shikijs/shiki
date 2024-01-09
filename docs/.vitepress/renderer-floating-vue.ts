import { rendererRich } from 'shikiji-twoslash'
import type { TwoSlashRenderers } from 'shikiji-twoslash'
import type { Element, Text } from 'hast'
import type { ShikijiTransformerContext } from 'shikiji'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'

const rich = rendererRich({
  classExtra: 'vp-copy-ignore',
})

function createFloatingVueWarpper(this: ShikijiTransformerContext, text: string, docs: string | undefined, node: Element | Text, presisted = false): Element {
  const themedContent = (this.codeToHast(
    text
      .replace(/^\(.+?\)\s+/, '')
      .replace(/\nimport .*$/, '')
      .replace(/\bshikiji_core\./g, '')
      .trim()
    ,
    {
      ...this.options,
      transformers: [],
      transforms: undefined,
    },
  ).children[0] as Element).children

  if (docs) {
    themedContent.push({
      type: 'element',
      tagName: 'div',
      properties: { class: 'twoslash-popup-jsdoc vp-doc' },
      children: (toHast(fromMarkdown(docs, {
        mdastExtensions: [gfmFromMarkdown()],
      })) as any).children,
    })
  }

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
        tagName: 'template',
        properties: {
          'v-slot:popper': '{}',
        },
        content: {
          type: 'root',
          children: themedContent,
        },
        children: [],
      },
    ],
  }
}

export const rendererFloatingVue: TwoSlashRenderers = {
  ...rich,
  nodeStaticInfo(info, node) {
    return createFloatingVueWarpper.call(this, info.text, info.docs, node)
  },
  nodeQuery(query, node) {
    if (!query.text)
      return {}
    return createFloatingVueWarpper.call(this, query.text, query.docs, node, true)
  },
}
