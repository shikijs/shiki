import type { HighlighterCore } from 'shiki/core'
import type { PropType } from 'vue'
import type { MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { computed, defineComponent, h } from 'vue'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

export const ShikiMagicMove = /* #__PURE__ */ defineComponent({
  name: 'ShikiMagicMove',
  props: {
    highlighter: {
      type: Object as PropType<HighlighterCore>,
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
    code: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<MagicMoveRenderOptions & MagicMoveDifferOptions>,
      default: () => ({}),
    },
  },
  emits: [
    'start',
    'end',
  ],
  setup(props, { emit }) {
    const machine = createMagicMoveMachine(
      code => codeToKeyedTokens(
        props.highlighter,
        code,
        {
          lang: props.lang,
          theme: props.theme,
        },
        props.options.lineNumbers,
      ),
      props.options,
    )

    const result = computed(() => machine.commit(props.code))

    return () => h(ShikiMagicMoveRenderer, {
      tokens: result.value.current,
      options: props.options,
      previous: result.value.previous,
      onStart: () => emit('start'),
      onEnd: () => emit('end'),
    })
  },
})
