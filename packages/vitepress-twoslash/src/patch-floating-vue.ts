import type { Popper } from 'floating-vue'
import type { App } from 'vue'

type FloatingVueMethods = Exclude<ReturnType<(typeof Popper)>['methods'], undefined>
type FloatingVueMethodsOverrides = { [Key in keyof FloatingVueMethods]?: FloatingVueMethodOverrideFn<Key> }
type FloatingVueMethodOverrideFn<T extends keyof FloatingVueMethods> = (
  ctx: ReturnType<typeof Popper>,
  baseImplementation: (args?: Parameters<FloatingVueMethods[T]>) => ReturnType<FloatingVueMethods[T]>,
  args: any,
) => void

export function patchFloatingVueMethods(app: App, methodOverrides: FloatingVueMethodsOverrides): void {
  const _component = app.component
  app.component = function (this: ReturnType<typeof Popper>, ...rest: any[]) {
    // @ts-expect-error type mismatch for `rest`
    const comp = _component.apply(this, rest)

    if (rest.length >= 2 && rest[0] === 'VMenu') {
      try {
        const PopperVue = rest[1].components.Popper
        const PopperTs = PopperVue.extends

        for (const method of Object.keys(methodOverrides)) {
          const _originalMethod = PopperTs.methods[method] ?? (() => {})
          const methodFn = methodOverrides[method as keyof typeof methodOverrides]
          PopperTs.methods[method] = async function (...args: any[]) {
            if (methodFn) {
              methodFn(this, _originalMethod, args)
            }
            else {
              _originalMethod(args)
            }
          }
        }
      }
      catch (e) {
        console.error('Failed to patch FloatingVue', e)
      }
    }
    return comp
  }
}

export function isShown(el: Element | undefined): boolean {
  if (!el)
    return false

  let current: Element | null = el
  while (current) {
    const style = getComputedStyle(current)
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false
    }
    current = current.parentElement
  }

  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}
