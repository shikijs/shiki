/// <reference types="vite/client" />

import type { BundledLanguageInfo, BundledThemeInfo } from '@shikijs/types'
import { useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, shallowRef, watch } from 'vue'

export const usePlayground = defineStore('playground', () => {
  const lang = useLocalStorage('shiki-playground-lang', 'typescript')
  const theme = useLocalStorage('shiki-playground-theme', 'vitesse-dark')
  const allThemes = shallowRef<BundledThemeInfo[]>([
    {
      id: 'vitesse-dark',
      displayName: 'Vitesse Dark',
      type: 'dark',
      import: undefined!,
    },
  ])
  const allLanguages = shallowRef<BundledLanguageInfo[]>([
    {
      id: 'typescript',
      name: 'TypeScript',
      import: undefined!,
    },
  ])
  const bundledLangsFull = shallowRef<BundledLanguageInfo[]>([])
  const bundledLangsWeb = shallowRef<BundledLanguageInfo[]>([])

  const input = useLocalStorage('shiki-playground-input', '')
  const output = ref('<pre></pre>')
  const preStyle = ref('')
  const isLoading = ref(true)

  function randomize(): void {
    if (allLanguages.value.length && allThemes.value.length) {
      lang.value = allLanguages.value[Math.floor(Math.random() * allLanguages.value.length)].id as any
      theme.value = allThemes.value[Math.floor(Math.random() * allThemes.value.length)].id as any
    }
  }

  ;(async () => {
    const { createHighlighter } = await import('shiki')
    const { bundledLanguagesInfo: bundleFull } = await import('shiki/bundle/full')
    const { bundledLanguagesInfo: bundleWeb } = await import('shiki/bundle/web')
    const { bundledThemesInfo } = await import('shiki/themes')

    const samplesCache = new Map<string, Promise<string | undefined>>()

    function fetchSample(id: string): Promise<string | undefined> {
      if (!samplesCache.has(id)) {
        samplesCache.set(id, fetch(`https://raw.githubusercontent.com/antfu/textmate-grammars-themes/main/samples/${id}.sample`)
          .then(r => r.text())
          .catch((e) => {
            console.error(e)
            return undefined
          }))
      }
      return samplesCache.get(id)!
    }

    allThemes.value = bundledThemesInfo
    allLanguages.value = bundleFull
    bundledLangsFull.value = bundleFull
    bundledLangsWeb.value = bundleWeb

    if (typeof window !== 'undefined') {
      const highlighter = await createHighlighter({
        themes: [theme.value],
        langs: ['typescript', 'javascript', lang.value as any],
      })

      watch(input, run, { immediate: true })

      watch([lang, theme], async (n, o) => {
        isLoading.value = true
        await Promise.all([
          highlighter.loadTheme(theme.value as any),
          highlighter.loadLanguage(lang.value as any),
        ])
        // Fetch sample if language changed
        if ((o[0] || !input.value) && n[0] !== o[0]) {
          const sample = await fetchSample(lang.value)
          if (sample)
            input.value = sample.trim().replace(/\n.*?from.*$/i, '').trim()
        }
        run()
      }, { immediate: true })

      function run(): void {
        output.value = highlighter.codeToHtml(input.value, {
          lang: lang.value,
          theme: theme.value,
          transformers: [
            {
              preprocess(code) {
                // Workaround for https://github.com/shikijs/shiki/issues/608
                // When last span is empty, it's height is 0px
                // so add a newline to render it correctly
                if (code.endsWith('\n'))
                  return `${code}\n`
              },
              pre(node) {
                preStyle.value = node.properties?.style as string || ''
              },
            },
          ],
        })
        isLoading.value = false
      }
    }
  })()

  return {
    lang,
    theme,
    allLanguages,
    allThemes,
    bundledLangsFull,
    bundledLangsWeb,
    input,
    output,
    isLoading,
    preStyle,
    randomize,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayground, import.meta.hot))
