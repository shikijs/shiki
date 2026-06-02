import type { PropType } from 'vue'
import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { defineComponent, h, nextTick, onMounted, ref, renderList, watch } from 'vue'
import { MagicMoveRenderer as Renderer } from '../renderer'

/**
 * A wrapper component to `MagicMoveRenderer`
 */
export const ShikiMagicMoveRenderer = /* #__PURE__ */ defineComponent({
  name: 'ShikiMagicMoveRenderer',
  props: {
    animate: {
      type: Boolean,
      default: true,
    },
    tokens: {
      type: Object as PropType<KeyedTokensInfo>,
      required: true,
    },
    previous: {
      type: Object as PropType<KeyedTokensInfo>,
      required: false,
    },
    options: {
      type: Object as PropType<MagicMoveRenderOptions>,
    },
  },
  emits: [
    'end',
    'start',
  ],
  setup(props, { emit }) {
    const container = ref<HTMLElement>()

    let isMounted = false

    onMounted(() => {
      // Remove previous content
      container.value!.innerHTML = ''
      isMounted = true
      const renderer = new Renderer(container.value!)

      watch(
        () => props.tokens,
        async (tokens) => {
          Object.assign(renderer.options, props.options)
          if (props.animate) {
            if (props.previous)
              renderer.replace(props.previous)
            await nextTick()
            const process = renderer.render(tokens)
            await nextTick()
            emit('start')
            await process
            emit('end')
          }
          else {
            renderer.replace(tokens)
          }
        },
        { immediate: true },
      )
    })

    return () => h(
      'pre',
      { ref: container, class: 'shiki-magic-move-container' },
      // Render initial tokens for SSR
      isMounted
        ? undefined
        : renderList(props.tokens.tokens, (token) => {
            if (token.content === '\n')
              return h('br', { key: token.key })
            return h(
              'span',
              {
                style: [{ color: token.color }, token.htmlStyle],
                class: ['shiki-magic-move-item', token.htmlClass],
                key: token.key,
              },
              token.content,
            )
          }),
    )
  },
})
