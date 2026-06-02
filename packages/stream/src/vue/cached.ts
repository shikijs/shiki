import type { HighlighterCore } from '@shikijs/core'
import type { PropType } from 'vue'
import { defineComponent, h, ref, watchEffect } from 'vue'
import { CodeToTokenTransformStream } from '../stream'
import { ShikiStreamRenderer } from './renderer'

/**
 * A simple wrapper around `ShikiStreamRenderer` that caches the code and only re-renders when the code changes.
 *
 * This component expects `code` prop to only be incrementally updated, and not set to a new value.
 * If you need to set the `code` prop to a new value, set a different `key` prop when it happens.
 */
export const ShikiCachedRenderer = defineComponent({
  name: 'ShikiCachedRenderer',
  props: {
    code: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    highlighter: {
      type: Object as PropType<HighlighterCore>,
      required: true,
    },
  },
  emits: ['stream-start', 'stream-end'],
  setup(props, { emit }) {
    const index = ref(0)
    let controller: ReadableStreamController<string> | null = null
    const textStream = new ReadableStream<string>({
      start(_controller) {
        controller = _controller
      },
    })

    watchEffect(() => {
      if (props.code.length > index.value) {
        controller?.enqueue(props.code.slice(index.value) as any)
        index.value = props.code.length
      }
    })

    const stream = textStream
      .pipeThrough(new CodeToTokenTransformStream({
        highlighter: props.highlighter,
        lang: props.lang,
        theme: props.theme,
        allowRecalls: true,
      }))

    return () => h(
      ShikiStreamRenderer,
      {
        stream,
        onStreamStart: () => emit('stream-start'),
        onStreamEnd: () => emit('stream-end'),
      },
    )
  },
})
