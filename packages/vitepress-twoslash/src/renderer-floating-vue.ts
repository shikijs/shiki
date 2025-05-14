import type { RendererRichOptions, TwoslashRenderer } from '@shikijs/twoslash'
import type { Element, ElementContent, Text } from 'hast'
import type { ShikiTransformerContextCommon } from 'shiki'
import { defaultHoverInfoProcessor, rendererRich } from '@shikijs/twoslash'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'

export { defaultHoverInfoProcessor }

export interface TwoslashFloatingVueOptions {
  classCopyIgnore?: string
  classFloatingPanel?: string
  classCode?: string
  classMarkdown?: string

  floatingVueTheme?: string
  floatingVueThemeQuery?: string
  floatingVueThemeCompletion?: string
}

export interface TwoslashFloatingVueRendererOptions extends RendererRichOptions {
  /**
   * Class and themes for floating-vue specific nodes
   */
  floatingVue?: TwoslashFloatingVueOptions
}

export function rendererFloatingVue(options: TwoslashFloatingVueRendererOptions = {}): TwoslashRenderer {
  const {
    classCopyIgnore = 'vp-copy-ignore',
    classFloatingPanel = 'twoslash-floating',
    classCode = 'vp-code',
    classMarkdown = 'vp-doc',
    floatingVueTheme = 'twoslash',
    floatingVueThemeQuery = 'twoslash-query',
    floatingVueThemeCompletion = 'twoslash-completion',
  } = options.floatingVue || {}

  const {
    errorRendering = 'line',
  } = options

  const hoverBasicProps = {
    'class': 'twoslash-hover',
    'popper-class': ['shiki', classFloatingPanel, classCopyIgnore, classCode].join(' '),
    'theme': floatingVueTheme,
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
          ':shown': 'true',
          'theme': floatingVueThemeQuery,
        },
      },
      queryCompose: compose,
      popupDocs: {
        class: `twoslash-popup-docs ${classMarkdown}`,
      },
      popupDocsTags: {
        class: `twoslash-popup-docs twoslash-popup-docs-tags ${classMarkdown}`,
      },
      popupError: {
        class: `twoslash-popup-error ${classMarkdown}`,
      },
      errorToken: errorRendering === 'line'
        ? undefined
        : {
            tagName: 'v-menu',
            properties: {
              ...hoverBasicProps,
              class: 'twoslash-error twoslash-error-hover',
            },
          },
      errorCompose: compose,
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
                  children: [vPre(popup)],
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

function vPre<T extends ElementContent>(el: T): T {
  if (el.type === 'element') {
    el.properties = el.properties || {}
    el.properties['v-pre'] = ''
  }
  return el
}

function renderMarkdown(this: ShikiTransformerContextCommon, md: string): ElementContent[] {
  const mdast = fromMarkdown(
    md.replace(/\{@link ([^}]*)\}/g, '$1'), // replace jsdoc links
    { mdastExtensions: [gfmFromMarkdown()] },
  )

  return (toHast(
    mdast,
    {
      handlers: {
        code: (state, node) => {
          const lang = node.lang || ''
          if (lang) {
            return <Element>{
              type: 'element',
              tagName: 'code',
              properties: {},
              children: this.codeToHast(
                node.value,
                {
                  ...this.options,
                  transformers: [],
                  lang,
                  structure: node.value.trim().includes('\n') ? 'classic' : 'inline',
                },
              ).children,
            }
          }
          return defaultHandlers.code(state, node)
        },
      },
    },
  ) as Element).children
}

function renderMarkdownInline(this: ShikiTransformerContextCommon, md: string, context?: string): ElementContent[] {
  if (context === 'tag:param')
    md = md.replace(/^([\w$-]+)/, '`$1` ')

  const children = renderMarkdown.call(this, md)
  if (children.length === 1 && children[0].type === 'element' && children[0].tagName === 'p')
    return children[0].children
  return children
}

function compose(parts: { token: Element | Text, popup: Element }): Element[] {
  if (parts.token.type === 'element' && parts.token.children.length < 1) {
    const classes = parts.token.properties.class || ''
    parts.token.properties.class = `${classes} twoslash-error-empty`
  }

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
        children: [vPre(parts.popup)],
      },
      children: [],
    },
  ]
}
