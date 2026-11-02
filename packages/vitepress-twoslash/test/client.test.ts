// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import TwoslashFloatingVue from '../src/client'

function mountMenu() {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
  const root = document.createElement('div')
  document.body.appendChild(root)

  const probe = createApp({ render: () => null })
  probe.use(TwoslashFloatingVue)
  const Menu: any = probe.component('VMenu')

  const app = createApp({
    render: () => h(Menu, { theme: 'twoslash', delay: 0 }, {
      default: () => h('span', { class: 'target' }, 'hover me'),
      popper: () => h('div', 'popup'),
    }),
  })
  app.use(TwoslashFloatingVue)
  app.mount(root)
  return { app, errors, root }
}

async function hover(root: HTMLElement) {
  root.querySelector('.target')!.dispatchEvent(new Event('mouseenter'))
  await new Promise(resolve => setTimeout(resolve, 50))
  await nextTick()
}

describe('vitepress-twoslash client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('patches VMenu without logging an error', () => {
    const { app, errors } = mountMenu()
    expect(errors).not.toHaveBeenCalled()
    app.unmount()
  })

  it('shows the popper on hover, but not while dragging', async () => {
    const { app, root } = mountMenu()
    const shown = () => root.querySelector('.v-popper')!.classList.contains('v-popper--shown')

    window.dispatchEvent(new Event('mousedown'))
    await hover(root)
    expect(shown()).toBe(false)

    window.dispatchEvent(new Event('mouseup'))
    await hover(root)
    expect(shown()).toBe(true)
    app.unmount()
  })
})
