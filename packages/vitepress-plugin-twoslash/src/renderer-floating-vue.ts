import { defaultCompletionIcons, defaultHoverInfoProcessor, rendererRich } from 'shikiji-twoslash'
import type { RendererRichOptions, TwoSlashRenderer } from 'shikiji-twoslash'
import type { Element, Text } from 'hast'
import type { ShikijiTransformerContext } from 'shikiji'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'
import { addClassToHast } from 'shikiji/core'
import type { VitePressPluginTwoSlashOptions } from 'vitepress-plugin-twoslash'

export { defaultHoverInfoProcessor }

export function rendererFloatingVue(options: VitePressPluginTwoSlashOptions & RendererRichOptions = {}): TwoSlashRenderer {
  const {
    processHoverInfo = defaultHoverInfoProcessor,
    processHoverDocs = docs => docs,
  } = options

  const rich = rendererRich({
    classExtra: 'vp-copy-ignore',
    ...options,
  })

  function createFloatingVueWarpper(this: ShikijiTransformerContext, text: string, docs: string | undefined, node: Element | Text, presisted = false): Element | undefined {
    const content = processHoverInfo(text)

    if ((!content || content === 'any'))
      return undefined

    const themedContent = (this.codeToHast(
      content,
      {
        ...this.options,
        transformers: [],
        lang: this.options.lang === 'vue' ? 'tsx' : this.options.lang,
      },
    ).children[0] as Element).children as Element[]

    // Add class to type nodes
    themedContent.forEach((node) => {
      addClassToHast(node, 'twoslash-popup-type')
    })

    if (docs) {
      docs = processHoverDocs(docs) ?? docs
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
        'theme': 'twoslash',
        ':arrow-padding': '8',
        ':auto-boundary-max-size': 'true',
        ...presisted && {
          ':shown': 'true',
          ':triggers': '["click"]',
          ':popper-triggers': '["click"]',
          ':auto-hide': 'false',
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

  const {
    completionIcons = defaultCompletionIcons,
  } = options

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
    nodeCompletion(query, node) {
      if (node.type !== 'text')
        throw new Error(`[shikiji-twoslash] nodeCompletion only works on text nodes, got ${node.type}`)

      const leftPart = query.completionsPrefix || ''
      const rightPart = node.value.slice(leftPart.length || 0)

      return <Element>{
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [
          {
            type: 'text',
            value: leftPart,
          },
          {
            type: 'element',
            tagName: 'v-menu',
            properties: {
              'popper-class': 'vp-code shiki floating-vue-twoslash-compeltion vp-copy-ignore',
              'placement': 'bottom-start',
              'theme': 'twoslash',
              ':distance': '0',
              ':arrow-overflow': 'true',
              ':auto-boundary-max-size': 'true',
              ':shown': 'true',
              ':triggers': '["click"]',
              ':popper-triggers': '["click"]',
              ':auto-hide': 'false',
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  class: 'twoslash-completion-cursor',
                },
              },
              {
                type: 'element',
                tagName: 'template',
                properties: {
                  'v-slot:popper': '{}',
                },
                content: {
                  type: 'root',
                  children: [{
                    type: 'element',
                    tagName: 'ul',
                    properties: {
                      class: 'twoslash-completion-list',
                    },
                    children: query.completions
                      .map((i): Element => ({
                        type: 'element',
                        tagName: 'li',
                        properties: {},
                        children: [
                          ...completionIcons
                            ? [<Element>{
                              type: 'element',
                              tagName: 'span',
                              properties: { class: `twoslash-completions-icon completions-${i.kind.replace(/\s/g, '-')}` },
                              children: [
                                completionIcons[i.kind] || completionIcons.property,
                              ].filter(Boolean),
                            }]
                            : [],
                          {
                            type: 'element',
                            tagName: 'span',
                            properties: {
                              class: i.kindModifiers?.split(',').includes('deprecated')
                                ? 'deprecated'
                                : undefined,
                            },
                            children: [
                              {
                                type: 'element',
                                tagName: 'span',
                                properties: { class: 'twoslash-completions-matched' },
                                children: [
                                  {
                                    type: 'text',
                                    value: query.completionsPrefix || '',
                                  },
                                ],
                              },
                              {
                                type: 'element',
                                tagName: 'span',
                                properties: { class: 'twoslash-completions-unmatched' },
                                children: [
                                  {
                                    type: 'text',
                                    value: i.name.slice(query.completionsPrefix?.length || 0),
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      })),
                  }],
                },
                children: [],
              },
            ],
          },
          {
            type: 'text',
            value: rightPart,
          },
        ],
      }
    },
  }
}
