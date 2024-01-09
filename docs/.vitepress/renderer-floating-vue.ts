import { rendererRich } from 'shikiji-twoslash'
import type { TwoSlashRenderers } from 'shikiji-twoslash'
import type { Element, Text } from 'hast'
import type { ShikijiTransformerContext } from 'shikiji'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'
import { addClassToHast } from 'shikiji'

const regexType = /^[A-Z][a-zA-Z0-9_]*(\<[^\>]*\>)?:/
const regexFunction = /^[a-zA-Z0-9_]*\(/
const regexMemberAccess = /^[a-zA-Z0-9_]*(\<[^\>]*\>)?\./

export function defaultTypeProcessor(type: string) {
  let content = type
    .replace(/^\((.+?)\)\s+/, '')
    .replace(/\nimport .*$/, '')
    .replace(/\bshikiji_core\./g, '')
    .replace(regexMemberAccess, '')
    .trim()

  if (content.match(regexType))
    content = `type ${content}`
  else if (content.match(regexFunction))
    content = `function ${content}`

  return content
}

export function rendererFloatingVue(): TwoSlashRenderers {
  const rich = rendererRich({
    classExtra: 'vp-copy-ignore',
  })

  function createFloatingVueWarpper(this: ShikijiTransformerContext, text: string, docs: string | undefined, node: Element | Text, presisted = false): Element | undefined {
    const content = defaultTypeProcessor(text)

    if ((!content || content === 'any'))
      return undefined

    const themedContent = (this.codeToHast(
      content,
      {
        ...this.options,
        transformers: [],
        transforms: undefined,
      },
    ).children[0] as Element).children as Element[]

    // Add class to type nodes
    themedContent.forEach((node) => {
      addClassToHast(node, 'twoslash-popup-type')
    })

    if (docs) {
      const mdast = fromMarkdown(docs, {
        mdastExtensions: [gfmFromMarkdown()],
      })
      const hast = toHast(mdast, {
        handlers: {
          code: (state, node) => {
            const lang = node.lang || ''
            if (lang) {
              return this.codeToHast(
                node.value,
                {
                  ...this.options,
                  transformers: [],
                  transforms: undefined,
                  lang,
                },
              ).children[0] as Element
            }
            return defaultHandlers.code(state, node)
          },
        },
      })
      themedContent.push({
        type: 'element',
        tagName: 'div',
        properties: {
          class: 'twoslash-popup-jsdoc vp-doc',
        },
        children: (hast as any).children,
      })
    }

    // Mark all nodes as v-pre for performance
    themedContent.forEach((node) => {
      node.properties ||= {}
      node.properties['v-pre'] = true
    })

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

  return {
    ...rich,
    nodeStaticInfo(info, node) {
      return createFloatingVueWarpper.call(this, info.text, info.docs, node) || {}
    },
    nodeQuery(query, node) {
      if (!query.text)
        return {}
      return createFloatingVueWarpper.call(this, query.text, query.docs, node, true) || {}
    },
  }
}
