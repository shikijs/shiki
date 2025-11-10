import type { App } from 'vue'
import FloatingVue, { recomputeAllPoppers } from 'floating-vue'
import { isShown, patchFloatingVueMethods } from './patch-floating-vue'

const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export type FloatingVueConfig = Parameters<(typeof FloatingVue)['install']>[1]

/**
 * Vue plugin to install FloatingVue with styles.
 *
 * Import this function in `.vitepress/theme/index.ts` and use `app.use(TwoslashFloatingVue)` inside the `enhanceApp` hook.
 */
const TwoslashFloatingVue = {
  install: (app: App, options: FloatingVueConfig = {}) => {
    if (typeof window !== 'undefined') {
      let isDragging = false

      // Recompute poppers when clicking on a tab
      window.addEventListener('click', (e) => {
        const path = e.composedPath()
        if (path.some((el: any) => el?.classList?.contains?.('vp-code-group') || el?.classList?.contains?.('tabs')))
          recomputeAllPoppers()
      }, { passive: true })

      // On desktop where the poppers are shown on hover, make sure that they do
      // not show or hide while we're dragging (selecting text) so they don't
      // interfere with the selection.
      if (!isMobile) {
        window.addEventListener('mousedown', () => {
          isDragging = true
        }, { passive: true })
        window.addEventListener('mouseup', () => {
          isDragging = false
        }, { passive: true })
      }

      // Patch floating-vue
      patchFloatingVueMethods(app, ({
        async $_computePosition(popper, baseImpl, args) {
          if (isShown(popper.$_referenceNode)) {
            await baseImpl.apply(popper, args)
            popper.$_popperNode.style.display = 'initial'
          }
          else {
            popper.$_popperNode.style.display = 'none'
          }
        },
        show: function show(popper, baseImpl, args) {
          if (!isDragging)
            baseImpl.apply(popper, args)
        },
        hide(popper, baseImpl, args) {
          if (!isDragging)
            baseImpl.apply(popper, args)
        },
      }))
    }

    app.use(FloatingVue, {
      ...options,
      themes: {
        ...options.themes,
        'twoslash': {
          $extend: 'dropdown',
          triggers: isMobile ? ['touch'] : ['hover', 'touch'],
          popperTriggers: isMobile ? ['touch'] : ['hover', 'touch'],
          placement: 'bottom-start',
          overflowPadding: 10,
          delay: 0,
          handleResize: false,
          autoHide: true,
          noAutoFocus: true,
          instantMove: true,
          flip: false,
          arrowPadding: 8,
          autoBoundaryMaxSize: true,
          ...options.themes?.twoslash ?? {},
        },
        'twoslash-query': {
          $extend: 'twoslash',
          triggers: ['click'],
          popperTriggers: ['click'],
          autoHide: false,
          noAutoFocus: true,
          ...options.themes?.['twoslash-query'] ?? {},
        },
        'twoslash-completion': {
          $extend: 'twoslash-query',
          triggers: ['click'],
          popperTriggers: ['click'],
          autoHide: false,
          noAutoFocus: true,
          distance: 0,
          arrowOverflow: true,
          ...options.themes?.['twoslash-completion'] ?? {},
        },
        /** @deprecated */
        ...options.theme,
      },
    })
  },
}

export default TwoslashFloatingVue
