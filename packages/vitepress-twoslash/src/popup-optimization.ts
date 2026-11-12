import type { Element, Root } from 'hast'
import { hastToHtml } from 'shiki/core'

const popups = new WeakSet<Element>()

export function registerPopup(node: Element): void {
  popups.add(node)
}

export function optimizePopupContent(node: Element | Root): void {
  if (node.type === 'element' && popups.has(node)) {
    // Keep nested markup opaque to Vue and VitePress's HTML string scanners.
    node.properties['v-html'] = JSON.stringify(hastToHtml(node.children)).replaceAll('<', '\\u003c')
    delete node.properties['v-pre']
    node.children = []
    return
  }

  for (const child of node.children ?? []) {
    if (child.type === 'element')
      optimizePopupContent(child)
  }
  if (node.type === 'element' && node.content)
    optimizePopupContent(node.content)
}
