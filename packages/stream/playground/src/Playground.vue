<script setup lang="ts">
import type { Highlighter } from 'shiki'
import type { Ref } from 'vue'
import type { RendererFactoryOptions, RendererFactoryResult, RendererType, RendererUpdatePayload } from './renderer/types'
import { toRefs, useLocalStorage } from '@vueuse/core'
import { createHighlighter } from 'shiki'
import { bundledLanguagesInfo } from 'shiki/langs'
import { bundledThemesInfo } from 'shiki/themes'
import { ref, shallowRef, watch } from 'vue'
import { version } from '../../package.json'
import { CodeToTokenTransformStream } from '../../src'
import { generateRandomTextStream } from '../../test/utils'
import { vueAfter, vueBefore } from './fixture'
import { createRendererReact } from './renderer/react'
import { createRendererSolid } from './renderer/solid'
import { createRendererSvelte } from './renderer/svelte'
import { createRendererVue } from './renderer/vue'

const defaultOptions = {
  theme: 'vitesse-dark',
  lang: 'vue',
  interval: 90,
  code: vueBefore,
  allowRecalls: true,
  rendererType: 'vue' as RendererType,
}

const options = useLocalStorage('shiki-stream-options', defaultOptions, { mergeDefaults: true }) as Ref<typeof defaultOptions>

const {
  theme,
  lang,
  code,
  interval,
  allowRecalls,
  rendererType,
} = toRefs(options)

const example = ref(vueBefore)
const input = ref(code.value)
const highlighter = ref<Highlighter>()
const isStreaming = ref(false)
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
    isStreaming.value = false
  },
  onStart() {
    isStreaming.value = true
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

  const stream = generateRandomTextStream(code.value, interval.value)
    .pipeThrough(new CodeToTokenTransformStream({
      highlighter: highlighter.value,
      lang: lang.value,
      theme: theme.value,
      allowRecalls: allowRecalls.value,
    }))

  const payload: RendererUpdatePayload = {
    stream,
  }

  if (!renderer || isStreaming.value) {
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
      // case 'web-component':
      //   renderer = createRendererWebComponent(rendererOptions)
      //   break
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

function rerun() {
  code.value = input.value
  rendererUpdate()
}

let timer: ReturnType<typeof setTimeout> | undefined

watch(
  [theme, lang, code, interval, allowRecalls, rendererContainer, highlighter, loadingPromise],
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
    <div class="flex flex-col items-center flex-none text-center">
      <span class="text-2xl font-200 bg-gradient-to-r from-teal to-orange inline-block text-transparent bg-clip-text">
        <span>Shiki</span>
        <span class="font-800 mx1">Stream</span>
        <span class="font-mono text-xs">v{{ version }}</span>
      </span>
      <div class="text-stone:75">
        Streaming highlighting with <a href="https://github.com/shikijs/shiki" target="_blank" class="underline">Shiki</a>.
        <a href="https://github.com/antfu/shiki-stream" target="_blank" class="underline">GitHub</a>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-auto of-hidden">
      <div class="of-hidden flex flex-col gap-4">
        <div class="flex-none flex flex-wrap gap-4 items-center mb--4px">
          <button class="border border-gray:20 rounded px3 py1 disabled:op50" :disabled="isStreaming" @click="rerun">
            Rerun
          </button>
          <div class="transition text-green text-sm" :class="isStreaming ? 'animate-pulse' : 'op0'">
            Streaming...
          </div>
        </div>
        <textarea
          v-model="input"
          class="font-mono w-full h-full flex-auto p-4 border border-gray:20 rounded bg-transparent min-h-100"
          @keydown.meta.enter.prevent="rerun"
        />
        <div class="flex-none flex flex-wrap gap-6 items-center">
          <label class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              Stream Interval
              <span class="op50 text-sm">{{ interval }}ms</span>
            </div>
            <input
              v-model="interval"
              type="range" min="1" max="2000"
              class="w-40"
            >
          </label>
          <label class="text-sm flex items-center gap-1">
            <input
              v-model="allowRecalls"
              type="checkbox"
            >
            Allow Recalls
          </label>
          <button class="border border-gray:20 rounded px3 py1" @click="resetOptions">
            Reset Options
          </button>
        </div>
      </div>
      <div class="of-auto flex flex-col gap-4">
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
            <!-- <option value="web-component">
              Web Component Renderer
            </option> -->
          </select>
        </div>
        <div ref="rendererContainer" class="of-auto p-4 border border-gray:20 rounded" />
      </div>
    </div>
  </div>
</template>
