import { defaultHoverInfoProcessor, rendererRich } from 'shikiji-twoslash'
import type { RendererRichOptions, TwoslashRenderer } from 'shikiji-twoslash'
import type { Element, ElementContent, Text } from 'hast'
import type { ShikijiTransformerContext, ShikijiTransformerContextCommon } from 'shikiji'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'
import type { VitePressPluginTwoslashOptions } from 'vitepress-plugin-twoslash'

export { defaultHoverInfoProcessor }

export function rendererFloatingVue(options: VitePressPluginTwoslashOptions & RendererRichOptions = {}): TwoslashRenderer {
  const hoverBasicProps = {
    'class': 'twoslash-hover',
    'popper-class': 'vp-code shiki floating-vue-twoslash vp-copy-ignore',
    'placement': 'bottom-start',
    'theme': 'twoslash',
    ':arrow-padding': '8',
    ':auto-boundary-max-size': 'true',
  }
  const hoverPresistedProps = {
    ...hoverBasicProps,
    ':shown': 'true',
    ':triggers': '["click"]',
    ':popper-triggers': '["click"]',
    ':auto-hide': 'false',
  }

  function compose(parts: { token: Element | Text, popup: Element }): Element[] {
    return [
      {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [parts.token],
      },
      {
        type: 'element',
        tagName: 'template',
        properties: {
          'v-slot:popper': '{}',
        },
        content: {
          type: 'root',
          children: [parts.popup],
        },
        children: [],
      },
    ]
  }

  const rich = rendererRich({
    classExtra: 'vp-copy-ignore',
    ...options,
    renderMarkdown,
    renderMarkdownInline,
    hast: {
      hoverToken: {
        tagName: 'v-menu',
        properties: hoverBasicProps,
      },
      hoverCompose: compose,
      queryToken: {
        tagName: 'v-menu',
        properties: hoverPresistedProps,
      },
      queryCompose: compose,
      popupDocs: {
        class: 'twoslash-popup-docs vp-doc',
      },
      popupDocsTags: {
        class: 'twoslash-popup-docs twoslash-popup-docs-tags vp-doc',
      },
      completionCompose({ popup, cursor }) {
        return [
          <Element>{
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
              cursor,
              {
                type: 'element',
                tagName: 'template',
                properties: {
                  'v-slot:popper': '{}',
                },
                content: {
                  type: 'root',
                  children: [popup],
                },
              },
            ],
          },
        ]
      },
    },
  })

  return rich
}

function renderMarkdown(this: ShikijiTransformerContextCommon, md: string): ElementContent[] {
  const mdast = fromMarkdown(md, { mdastExtensions: [gfmFromMarkdown()] })
  return (toHast(
    mdast,
    {
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
    },
  ) as Element).children
}

function renderMarkdownInline(this: ShikijiTransformerContext, md: string): ElementContent[] {
  const children = renderMarkdown.call(
    this,
    md
      .replace(/{@link ([^}]*)}/g, '$1'), // replace jsdoc links
  )
  if (children.length === 1 && children[0].type === 'element' && children[0].tagName === 'p')
    return children[0].children
  return children
}
