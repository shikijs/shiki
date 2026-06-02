<script setup lang="ts">
import type { Highlighter } from 'shiki'
import type { RendererFactoryOptions, RendererFactoryResult, RendererType, RendererUpdatePayload } from './renderer/types'
import { toRefs, useLocalStorage } from '@vueuse/core'
import { createHighlighter } from 'shiki'
import { bundledLanguagesInfo } from 'shiki/langs'
import { bundledThemesInfo } from 'shiki/themes'
import { ref, shallowRef, watch } from 'vue'
import { vueAfter, vueBefore } from './fixture'
import { createRendererReact } from './renderer/react'
import { createRendererSolid } from './renderer/solid'
import { createRendererSvelte } from './renderer/svelte.svelte'
import { createRendererVue } from './renderer/vue'
import { createRendererWebComponent } from './renderer/web-component'

const defaultOptions = {
  theme: 'vitesse-dark',
  lang: 'vue',
  autoCommit: true,
  duration: 750,
  code: vueBefore,
  useDebugStyles: false,
  stagger: 3,
  rendererType: 'vue' as RendererType,
  lineNumbers: false,
}

const options = useLocalStorage('shiki-magic-move-options', defaultOptions, { mergeDefaults: true })

const {
  theme,
  lang,
  code,
  duration,
  autoCommit,
  useDebugStyles,
  stagger,
  rendererType,
  lineNumbers,
} = toRefs<typeof defaultOptions>(options)

const example = ref(vueBefore)
const input = ref(code.value)
const highlighter = ref<Highlighter>()
const isAnimating = ref(false)
const rendererContainer = ref<HTMLElement>()

let renderer: RendererFactoryResult

const loadingPromise = shallowRef<Promise<void> | undefined>(
  createHighlighter({
    themes: [theme.value],
    langs: [lang.value],
  }).then((h) => {
    highlighter.value = h
    loadingPromise.value = undefined
  }),
)

const rendererOptions: RendererFactoryOptions = {
  onEnd() {
    isAnimating.value = false
  },
  onStart() {
    isAnimating.value = true
  },
}

watch(
  rendererType,
  () => {
    if (renderer) {
      renderer?.dispose()
      renderer = undefined as any
    }
    rendererUpdate()
  },
  { flush: 'sync' },
)

function rendererUpdate() {
  if (!rendererContainer.value || !highlighter.value || loadingPromise.value)
    return

  const payload: RendererUpdatePayload = {
    highlighter: highlighter.value,
    theme: theme.value,
    lang: lang.value,
    code: code.value,
    class: 'font-mono w-fit p-4 border border-gray:20 shadow-xl rounded of-hidden',
    options: {
      duration: duration.value,
      stagger: stagger.value,
      lineNumbers: lineNumbers.value,
    },
  }

  if (!renderer) {
    switch (rendererType.value) {
      case 'vue':
        renderer = createRendererVue(rendererOptions)
        break
      case 'react':
        renderer = createRendererReact(rendererOptions)
        break
      case 'solid':
        renderer = createRendererSolid(rendererOptions)
        break
      case 'svelte':
        renderer = createRendererSvelte(rendererOptions)
        break
      case 'web-component':
        renderer = createRendererWebComponent(rendererOptions)
        break
    }

    renderer.mount(rendererContainer.value, payload)
  }
  else {
    renderer.update(payload)
  }
}

const samplesCache = new Map<string, Promise<string>>()

async function fetchSample(id: string): Promise<string> {
  if (!samplesCache.has(id)) {
    samplesCache.set(id, fetch(`https://raw.githubusercontent.com/shikijs/textmate-grammars-themes/main/samples/${id}.sample`)
      .then(r => r.text())
      .catch((e) => {
        console.error(e)
        return `ERROR: ${e.message}`
      }))
  }
  return samplesCache.get(id)!
}

async function reset() {
  if (lang.value === 'vue')
    example.value = example.value === vueBefore ? vueAfter : vueBefore
  else
    example.value = await fetchSample(lang.value)
  input.value = example.value
  code.value = example.value
}

async function resetOptions() {
  Object.assign(options.value, defaultOptions)
  example.value = defaultOptions.code
  input.value = defaultOptions.code
}

function commit() {
  code.value = input.value
}

let timer: ReturnType<typeof setTimeout> | undefined

watch(
  [theme, lang, code, duration, stagger, lineNumbers, rendererContainer, highlighter, loadingPromise],
  (n, o) => {
    if (n.every((v, i) => v === o[i]))
      return
    rendererUpdate()
  },
  { flush: 'post', deep: true, immediate: true },
)

watch(
  input,
  () => {
    if (timer)
      clearTimeout(timer)
    if (autoCommit.value)
      timer = setTimeout(commit, 300)
  },
)

watch(
  [theme, lang],
  (n, o) => {
    const previous = loadingPromise.value || Promise.resolve()

    loadingPromise.value = previous.then(() => {
      const promises: Promise<void>[] = []
      if (!highlighter.value!.getLoadedLanguages().includes(lang.value))
        promises.push(highlighter.value!.loadLanguage(lang.value as any))
      if (!highlighter.value!.getLoadedThemes().includes(theme.value))
        promises.push(highlighter.value!.loadTheme(theme.value as any))
      if (n[1] !== o[1]) {
        promises.push(fetchSample(lang.value).then((code) => {
          example.value = code || 'ERROR'
          reset()
        }))
      }
      return Promise.all(promises)
    })
      .then(() => {
        loadingPromise.value = undefined
      })
  },
  {
    flush: 'sync',
  },
)
</script>

<template>
  <div class="flex flex-col font-sans min-h-screen lg:max-h-screen px4 py4 gap-4">
    <div class="flex flex-col items-center flex-none  text-center">
      <span class="text-2xl font-200 bg-gradient-to-r from-teal to-orange inline-block text-transparent bg-clip-text">
        <span>Shiki</span>
        <span class="font-800 mx1">Magic</span>
        <span class="italic font-serif">Move</span>
      </span>
      <div class="text-stone:75">
        Smoothly animated code blocks with <a href="https://github.com/shikijs/shiki" target="_blank" class="underline">Shiki</a>.
        <a href="https://github.com/shikijs/shiki-magic-move" target="_blank" class="underline">GitHub</a>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-auto of-hidden">
      <div class="of-hidden flex flex-col gap-4">
        <div class="flex-none flex flex-wrap gap-4 items-center mb--4px">
          <button class="border border-gray:20 rounded px3 py1" @click="reset">
            {{ lang === 'vue' ? 'Toggle Examples' : 'Reset Example' }}
          </button>
          <label class="text-sm flex items-center gap-1">
            <input
              v-model="autoCommit"
              type="checkbox"
            >
            Auto Commit
          </label>
          <button v-if="!autoCommit" class="border border-gray:20 rounded px3 py1" @click="commit">
            Commit Changes
          </button>
          <div class="transition text-green text-sm" :class="isAnimating ? 'animate-pulse' : 'op0'">
            Animating...
          </div>
        </div>
        <textarea
          v-model="input"
          class="font-mono w-full h-full flex-auto p-4 border border-gray:20 rounded bg-transparent min-h-100"
          @keydown.meta.enter.prevent="commit"
        />
        <div class="flex-none flex flex-wrap gap-6 items-center">
          <label class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              Duration
              <span class="op50 text-sm">{{ duration }}ms</span>
            </div>
            <input
              v-model="duration"
              type="range" min="100" max="20000"
              class="w-40"
            >
          </label>
          <label class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              Stagger
              <span class="op50 text-sm">{{ stagger }}ms</span>
            </div>
            <input
              v-model="stagger"
              type="range" min="0" max="20"
              class="w-40"
            >
          </label>
          <label class="text-sm flex items-center gap-1">
            <input
              v-model="useDebugStyles"
              type="checkbox"
            >
            Style for debugging
          </label>
          <label class="text-sm flex items-center gap-1">
            <input
              v-model="lineNumbers"
              type="checkbox"
            >
            Line Numbers
          </label>
          <div class="flex-auto" />
          <button class="border border-gray:20 rounded px3 py1" @click="resetOptions">
            Reset Options
          </button>
        </div>
      </div>
      <div class="of-auto flex flex-col gap-4" :class="useDebugStyles ? 'magic-move-debug-style' : ''">
        <div class="flex-none flex flex-wrap gap-2 items-center">
          <select
            v-model="theme"
            class="border border-gray:20 rounded px2 py1 text-sm"
          >
            <option
              v-for="t of bundledThemesInfo"
              :key="t.id"
              :value="t.id"
            >
              {{ t.displayName }}
            </option>
          </select>
          <select
            v-model="lang"
            class="border border-gray:20 rounded px2 py1 text-sm"
          >
            <option
              v-for="l of bundledLanguagesInfo"
              :key="l.id"
              :value="l.id"
            >
              {{ l.name }}
            </option>
          </select>
          <select
            v-model="rendererType"
            class="border border-gray:20 rounded px2 py1 text-sm"
          >
            <option value="vue">
              Vue Renderer
            </option>
            <option value="react">
              React Renderer
            </option>
            <option value="solid">
              Solid Renderer
            </option>
            <option value="svelte">
              Svelte Renderer
            </option>
            <option value="web-component">
              Web Component Renderer
            </option>
          </select>
        </div>
        <div ref="rendererContainer" class="of-auto" />
      </div>
    </div>
  </div>
</template>

<style>
.magic-move-debug-style .shiki-magic-move-move {
  background: #8883;
}
.magic-move-debug-style .shiki-magic-move-enter-active {
  background: rgba(92, 183, 47, 0.3);
}
.magic-move-debug-style .shiki-magic-move-leave-active {
  background: rgba(183, 47, 47, 0.533);
}
</style>
