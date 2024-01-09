import { rendererRich, transformerTwoSlash } from 'shikiji-twoslash'
import type { TransformerTwoSlashOptions, TwoSlashRenderers } from 'shikiji-twoslash'
import type { Element, Text } from 'hast'
import type { ShikijiTransformer, ShikijiTransformerContext } from 'shikiji'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'
import { addClassToHast } from 'shikiji/core'

const regexType = /^[A-Z][a-zA-Z0-9_]*(\<[^\>]*\>)?:/
const regexFunction = /^[a-zA-Z0-9_]*\(/

export interface VitePressPluginTwoSlashOptions extends TransformerTwoSlashOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: boolean

  processHoverInfo?: (info: string) => string
  processHoverDocs?: (docs: string) => string
}

/**
 * Create a Shikiji transformer for VitePress to enable twoslash integration
 *
 * Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
 */
export function transformerTwoslash(options: VitePressPluginTwoSlashOptions = {}): ShikijiTransformer {
  const twoslash = transformerTwoSlash({
    explicitTrigger: true,
    renderer: rendererFloatingVue(),
    ...options,
  })

  return {
    ...twoslash,
    name: 'vitepress-plugin-twoslash',
    preprocess(code, options) {
      const cleanup = options.transformers?.find(i => i.name === 'vitepress:clean-up')
      if (cleanup)
        options.transformers?.splice(options.transformers.indexOf(cleanup), 1)

      // Disable v-pre for twoslash, because we need render it with FloatingVue
      if (options.meta?.__raw?.includes('twoslash')) {
        const vPre = options.transformers?.find(i => i.name === 'vitepress:v-pre')
        if (vPre)
          options.transformers?.splice(options.transformers.indexOf(vPre), 1)
      }

      return twoslash.preprocess!.call(this, code, options)
    },
  }
}

export function defaultInfoProcessor(type: string) {
  let content = type
    // remove leading `(property)` or `(method)` on each line
    .replace(/^\(([\w-]+?)\)\s+/mg, '')
    // remove import statement
    .replace(/\nimport .*$/, '')
    // remove interface or namespace lines with only the name
    .replace(/^(interface|namespace) \w+$/mg, '')
    .trim()

  // Add `type` or `function` keyword if needed
  if (content.match(regexType))
    content = `type ${content}`
  else if (content.match(regexFunction))
    content = `function ${content}`

  return content
}

export function rendererFloatingVue(options: VitePressPluginTwoSlashOptions = {}): TwoSlashRenderers {
  const {
    processHoverInfo = defaultInfoProcessor,
    processHoverDocs = docs => docs,
  } = options

  const rich = rendererRich({
    classExtra: 'vp-copy-ignore',
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
        transforms: undefined,
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
        'theme': 'twoslash',
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
