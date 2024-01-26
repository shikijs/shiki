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
  const classCopyIgnore = 'vp-copy-ignore'
  const classFloatingPanel = 'twoslash-floating'
  const classCode = 'vp-code'
  const classMarkdown = 'vp-doc'
  const floatingVueTheme = 'twoslash'
  const floatingVueThemeQuery = 'twoslash-query'
  const floatingVueThemeCompletion = 'twoslash-completion'

  const hoverBasicProps = {
    'class': 'twoslash-hover',
    'popper-class': ['shiki', classFloatingPanel, classCopyIgnore, classCode].join(' '),
    'theme': floatingVueTheme,
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
    classExtra: classCopyIgnore,
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
        properties: {
          ...hoverBasicProps,
          theme: floatingVueThemeQuery,
        },
      },
      queryCompose: compose,
      popupDocs: {
        class: `twoslash-popup-docs ${classMarkdown}`,
      },
      popupDocsTags: {
        class: `twoslash-popup-docs twoslash-popup-docs-tags ${classMarkdown}`,
      },
      completionCompose({ popup, cursor }) {
        return [
          <Element>{
            type: 'element',
            tagName: 'v-menu',
            properties: {
              'popper-class': ['shiki twoslash-completion', classCopyIgnore, classFloatingPanel],
              'theme': floatingVueThemeCompletion,
              ':shown': 'true',
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
