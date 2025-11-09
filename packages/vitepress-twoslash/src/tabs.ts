import { recomputeAllPoppers } from 'floating-vue'

/** Recompute poppers when clicking on a tab */
export function handleTabClicks(e: MouseEvent): void {
  const el = e.target as HTMLInputElement
  if (!(el?.matches('.vp-code-group input') && recomputeCodeGroupPoppers(el))) {
    const path = e.composedPath()
    if (path.some((el: any) => el?.classList?.contains?.('tabs'))) {
      recomputeAllPoppers()
    }
  }
}

/** Create and auto-destroy a MutationObserver waiting for an "active" class */
function waitForActiveClass(el: Element): Promise<void> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes'
          && mutation.attributeName === 'class'
          && el.classList.contains('active')
        ) {
          observer.disconnect()
          resolve()
          break
        }
      }
    })

    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    if (el.classList.contains('active')) {
      observer.disconnect()
      resolve()
    }
  })
}

/** Recompute the code group poppers once they're active */
function recomputeCodeGroupPoppers(el: HTMLInputElement): boolean {
  const next = getNextCodeGroup(el)
  if (!next)
    return false

  if (next.classList.contains('active')) {
    recomputeAllPoppers()
    return true
  }

  waitForActiveClass(next).then(recomputeAllPoppers)
  return true
}

/**
 * Get upcoming group's codeblcok element
 * @note Based on https://github.com/vuejs/vitepress/blob/main/src/client/app/composables/codeGroups.ts#L16
 */
function getNextCodeGroup(el: HTMLInputElement): Element | undefined {
  // input <- .tabs <- .vp-code-group
  const group = el.parentElement?.parentElement
  if (!group)
    return

  const i = Array.from(group.querySelectorAll('input')).indexOf(el)
  if (i < 0)
    return

  const blocks = group.querySelector('.blocks')
  if (!blocks)
    return

  const current = Array.from(blocks.children).find(child =>
    child.classList.contains('active'),
  )

  if (!current)
    return

  const next = blocks.children[i]

  if (!next || current === next)
    return

  return next
}
