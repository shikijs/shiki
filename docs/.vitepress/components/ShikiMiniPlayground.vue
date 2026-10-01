<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { usePlayground } from '../store/playground'
import FundingButton from './FundingButton.vue'

const play = usePlayground()
const currentLang = computed(() => play.allLanguages.find(i => i.name === play.lang))
const currentTheme = computed(() => play.allThemes.find(i => i.name === play.theme))

const textAreaRef = ref<HTMLDivElement>()
const highlightContainerRef = ref<HTMLSpanElement>()
const isExporting = ref(false)

function syncScroll() {
  if (!highlightContainerRef.value || !textAreaRef.value)
    return
  const preEl = highlightContainerRef.value.children[0] as HTMLPreElement
  if (!preEl)
    return
  // preEl.scrollTop = textAreaRef.value.scrollTop
  preEl.scrollLeft = textAreaRef.value.scrollLeft
}

function onInput() {
  nextTick().then(() => {
    syncScroll()
  })
}

async function exportAsImage() {
  if (!highlightContainerRef.value || isExporting.value)
    return

  isExporting.value = true

  try {
    const preEl = highlightContainerRef.value.querySelector('pre.shiki') as HTMLPreElement
    if (!preEl)
      return

    const padding = 32
    const rect = preEl.getBoundingClientRect()
    const width = Math.ceil(rect.width) + padding * 2
    const height = Math.ceil(rect.height) + padding * 2

    // Collect all computed styles from the page so the SVG foreignObject renders correctly
    const styleSheets: string[] = []
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = Array.from(sheet.cssRules || [])
        styleSheets.push(rules.map(r => r.cssText).join('\n'))
      }
      catch {
        // Cross-origin stylesheet — skip
      }
    }

    // Clone the node so we can apply overrides without affecting the live DOM
    const clone = preEl.cloneNode(true) as HTMLPreElement
    clone.style.margin = '0'
    clone.style.borderRadius = '0'
    clone.style.boxShadow = 'none'
    clone.style.overflow = 'visible'
    clone.style.width = `${rect.width}px`
    clone.style.padding = `${padding}px`

    const outerDiv = document.createElement('div')
    outerDiv.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    `
    outerDiv.appendChild(clone)

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <style>${styleSheets.join('\n')}</style>
        <foreignObject x="0" y="0" width="${width}" height="${height}">
          <html xmlns="http://www.w3.org/1999/xhtml">
            <head><style>* { box-sizing: border-box; }</style></head>
            <body style="margin:0;padding:0;">${outerDiv.outerHTML}</body>
          </html>
        </foreignObject>
      </svg>
    `

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const img = new Image()
    img.width = width
    img.height = height

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
      img.src = url
    })

    const canvas = document.createElement('canvas')
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.drawImage(img, 0, 0)

    URL.revokeObjectURL(url)

    const pngUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = `shiki-${play.lang}-${play.theme}.png`
    a.click()
  }
  finally {
    isExporting.value = false
  }
}
</script>

<template>
  <div
    class="language-ts vp-adaptive-theme transition-none! mini-playground shadow"
    :style="[play.preStyle, { colorScheme: currentTheme?.type || 'inherit' }]"
  >
    <div class="sticky z-12 p2 px3 pl5 flex gap-4 items-center left-0 top-0 right-0 b-solid border-gray/5 bg-inherit">
      <label class="relative flex gap-1 items-center justify-start min-w-[8em]">
        <div class="i-carbon:chevron-down op50" />
        <span class="font-mono text-xs">{{ currentLang?.name }}</span>
        <select v-model="play.lang" :style="play.preStyle" class="font-mono absolute inset-0 min-w-0 op0">
          <option v-for="lang in play.allLanguages" :key="lang.name" :value="lang.name">
            {{ lang.name }}
          </option>
        </select>
        <FundingButton :name="`${currentLang?.displayName} grammar`" :funding="currentLang?.funding" />
      </label>
      <label class="relative flex gap-1 items-center justify-start min-w-[8em]">
        <div class="i-carbon:chevron-down op50" />
        <span class="font-mono text-xs">{{ currentTheme?.displayName }}</span>
        <select v-model="play.theme" :style="play.preStyle" class="font-mono absolute inset-0 min-w-0 op0">
          <option v-for="theme in play.allThemes.filter(i => i.type === 'light')" :key="theme.name" :value="theme.name">
            {{ theme.displayName }}
          </option>
          <option disabled>
            ──────────
          </option>
          <option v-for="theme in play.allThemes.filter(i => i.type === 'dark')" :key="theme.name" :value="theme.name">
            {{ theme.displayName }}
          </option>
        </select>
        <FundingButton :name="`${currentTheme?.displayName} theme`" :funding="currentTheme?.funding" />
      </label>
      <div class="flex-auto" />
      <div
        class="i-svg-spinners-3-dots-fade flex-none transition-opacity"
        :class="play.isLoading ? 'op100' : 'op0'"
      />
      <a href="https://textmate-grammars-themes.netlify.app/" target="_blank" title="Full Playground" class="op50 text-xs mx-2 hover:op75 decoration-none! text-inherit!">
        Playground
      </a>
      <button title="Randomize" class="hover:bg-gray/10 p1 rounded" @click="play.randomize">
        <div class="i-carbon:shuffle op50" />
      </button>
      <button title="Export as image" hover="bg-gray/10" p1 rounded :disabled="isExporting" @click="exportAsImage">
        <div :class="isExporting ? 'i-svg-spinners-3-dots-fade' : 'i-carbon:camera'" op50 />
      </button>
    </div>
    <div class="relative min-h-100 float-left min-w-full">
      <span ref="highlightContainerRef" v-html="play.output" />
      <textarea
        ref="textAreaRef"
        v-model="play.input"
        class="whitespace-pre overflow-auto w-full h-full font-mono bg-transparent absolute inset-0 py-20px px-24px text-transparent caret-gray tab-4 resize-none z-10 line-height-$vp-code-line-height font-$vp-font-family-mono text-size-$vp-code-font-size"
        autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
        @input="onInput"
        @scroll="syncScroll"
      />
    </div>
  </div>
</template>

<style>
.mini-playground select {
  background: transparent;
  color: inherit;
  padding: 0px !important;
}
.mini-playground select:focus {
  outline: none;
}

.mini-playground select:before {
  content: '';
  position: absolute;
  width: 1em;
  height: 1em;
  background: red;
}
</style>
