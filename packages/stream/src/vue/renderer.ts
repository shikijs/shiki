import type { ThemedToken } from '@shikijs/core'
import type { PropType } from 'vue'
import type { RecallToken } from '..'
import { objectId } from '@antfu/utils'
import { getTokenStyleObject } from '@shikijs/core'
import { defineComponent, h, reactive, renderList, watch } from 'vue'

export const ShikiStreamRenderer = defineComponent({
  name: 'ShikiStreamRenderer',
  props: {
    stream: {
      type: Object as PropType<ReadableStream<ThemedToken | RecallToken>>,
      required: true,
    },
  },
  emits: ['stream-start', 'stream-end'],
  setup(props, { emit }) {
    const tokens = reactive<ThemedToken[]>([])
    let currentAbortController: AbortController | null = null

    watch(
      () => props.stream,
      (newStream) => {
        tokens.length = 0

        if (currentAbortController) {
          currentAbortController.abort()
        }

        currentAbortController = new AbortController()
        const signal = currentAbortController.signal
        let started = false

        newStream.pipeTo(new WritableStream({
          write(token) {
            if (signal.aborted) {
              return
            }

            if (!started) {
              started = true
              emit('stream-start')
            }
            if ('recall' in token)
              tokens.length -= token.recall
            else
              tokens.push(token)
          },
          close: () => {
            if (!signal.aborted) {
              emit('stream-end')
            }
          },
          abort: () => {
            if (!signal.aborted) {
              emit('stream-end')
            }
          },
        }), { signal }).catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Stream error:', error)
          }
        })
      },
      { immediate: true },
    )

    return () => h(
      'pre',
      { class: 'shiki shiki-stream' },
      h(
        'code',
        renderList(tokens, token => h('span', { key: objectId(token), style: token.htmlStyle || getTokenStyleObject(token) }, token.content)),
      ),
    )
  },
})
