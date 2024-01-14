import type { TwoSlashRenderer } from './types'

/**
 * The default renderer aligning with the original `shiki-twoslash` output.
 */
export function rendererClassic(): TwoSlashRenderer {
  return {
    nodeStaticInfo(info, node) {
      return {
        type: 'element',
        tagName: 'data-lsp',
        properties: {
          lsp: info.text,
        },
        children: [node],
      }
    },

    nodeError(_, node) {
      return {
        type: 'element',
        tagName: 'data-err',
        properties: {},
        children: [node],
      }
    },

    lineError(error) {
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            class: 'error',
          },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: error.text,
                },
              ],
            },
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: 'code',
              },
              children: [
                {
                  type: 'text',
                  value: String(error.code),
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {
            class: 'error-behind',
          },
          children: [
            {
              type: 'text',
              value: error.text,
            },
          ],
        },
      ]
    },

    lineCompletion(query) {
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: { class: 'meta-line' },
          children: [
            { type: 'text', value: ' '.repeat(query.character) },
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'inline-completions' },
              children: [{
                type: 'element',
                tagName: 'ul',
                properties: { class: 'dropdown' },
                children: query.completions!
                  .filter(i => i.name.startsWith(query.completionsPrefix || '____'))
                  .map(i => ({
                    type: 'element',
                    tagName: 'li',
                    properties: {
                      class: i.kindModifiers?.split(',').includes('deprecated')
                        ? 'deprecated'
                        : undefined,
                    },
                    children: [{
                      type: 'element',
                      tagName: 'span',
                      properties: {},
                      children: [
                        {
                          type: 'element',
                          tagName: 'span',
                          properties: { class: 'result-found' },
                          children: [
                            {
                              type: 'text',
                              value: query.completionsPrefix || '',
                            },
                          ],
                        },
                        {
                          type: 'text',
                          value: i.name.slice(query.completionsPrefix?.length || 0),
                        },
                      ],
                    }],
                  })),
              }],
            },
          ],
        },
      ]
    },

    lineQuery(query, targetNode) {
      const targetText = targetNode?.type === 'text' ? targetNode.value : ''
      const offset = Math.max(0, (query.character || 0) + Math.floor(targetText.length / 2) - 1)

      return [
        {
          type: 'element',
          tagName: 'div',
          properties: { class: 'meta-line' },
          children: [
            { type: 'text', value: ' '.repeat(offset) },
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'popover' },
              children: [
                {
                  type: 'element',
                  tagName: 'div',
                  properties: { class: 'arrow' },
                  children: [],
                },
                {
                  type: 'text',
                  value: query.text || '',
                },
              ],
            },
          ],
        },
      ]
    },

    lineCustomTag(tag) {
      return [
        {
          type: 'element',
          tagName: 'div',
          properties: { class: `meta-line logger ${tag.name}-log` },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { class: 'message' },
              children: [
                {
                  type: 'text',
                  value: tag.text || '',
                },
              ],
            },
          ],
        },
      ]
    },
  }
}
