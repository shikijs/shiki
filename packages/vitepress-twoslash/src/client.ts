import type { App } from 'vue'
import FloatingVue, { recomputeAllPoppers } from 'floating-vue'

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
      // Recompute poppers when clicking on a tab
      window.addEventListener('vitepress:codeGroupTabActivate', recomputeAllPoppers, { passive: true })
      window.addEventListener('click', (e) => {
        const path = e.composedPath()
        if (path.some((el: any) => el?.classList?.contains?.('vp-code-group') || el?.classList?.contains?.('tabs')))
          recomputeAllPoppers()
      }, { passive: true })

      // On desktop where the poppers are shown on hover, make sure that they do
      // not show or hide while we're dragging (selecting text) so they don't
      // interfere with the selection.
      if (!isMobile) {
        let isDragging = false
        window.addEventListener('mousedown', () => {
          isDragging = true
        }, { passive: true })
        window.addEventListener('mouseup', () => {
          isDragging = false
        }, { passive: true })

        const _component = app.component
        app.component = function (this: typeof app, ...rest: any[]) {
          // @ts-expect-error type mismatch for `rest`
          const comp = _component.apply(this, rest)
          if (rest.length >= 2 && rest[0] === 'VMenu') {
            try {
              const PopperVue = rest[1].components.Popper
              const PopperTs = PopperVue.extends

              const _show = PopperTs.methods.show
              PopperTs.methods.show = function (...args: any[]) {
                if (!isDragging)
                  return _show.apply(this, args)
              }

              const _hide = PopperTs.methods.hide
              PopperTs.methods.hide = function (...args: any[]) {
                if (!isDragging)
                  return _hide.apply(this, args)
              }
            }
            catch (e) {
              console.error('Failed to patch FloatingVue', e)
            }
          }
          return comp
        }
      }
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
      },
    })
  },
}

export default TwoslashFloatingVue
