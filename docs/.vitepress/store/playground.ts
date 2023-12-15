/// <reference types="vite/client" />

import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BuiltinLanguage, BuiltinTheme, BundledLanguageInfo, BundledThemeInfo } from 'shikiji'
import { useLocalStorage } from '@vueuse/core'
import { ref, shallowRef, watch } from 'vue'

export const usePlayground = defineStore('playground', () => {
  const lang = useLocalStorage<BuiltinLanguage>('shikiji-playground-lang', 'typescript')
  const theme = useLocalStorage<BuiltinTheme>('shikiji-playground-theme', 'vitesse-dark')
  const allThemes = shallowRef<BundledThemeInfo[]>([
    {
      id: 'vitesse-dark',
      name: 'Vitesse Dark',
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
  const input = useLocalStorage('shikiji-playground-input', '')
  const output = ref('<pre></pre>')
  const preStyle = ref('')
  const isLoading = ref(true)

  function randomize() {
    if (allLanguages.value.length && allThemes.value.length) {
      lang.value = allLanguages.value[Math.floor(Math.random() * allLanguages.value.length)].id as any
      theme.value = allThemes.value[Math.floor(Math.random() * allThemes.value.length)].id as any
    }
  }

  if (typeof window !== 'undefined') {
    (async () => {
      const { getHighlighter, addClassToHast } = await import('shikiji')
      const { bundledLanguagesInfo } = await import('shikiji/langs')
      const { bundledThemesInfo } = await import('shikiji/themes')
      const highlighter = await getHighlighter({
        themes: [theme.value],
        langs: ['typescript', 'javascript', lang.value as any],
      })

      const samplesCache = new Map<string, Promise<string | undefined>>()

      function fetchSample(id: string) {
        if (!samplesCache.has(id)) {
          samplesCache.set(id, fetch(`https://raw.githubusercontent.com/shikijs/shiki/main/packages/shiki/samples/${id}.sample`)
            .then(r => r.text())
            .catch((e) => {
              console.error(e)
              return undefined
            }))
        }
        return samplesCache.get(id)!
      }

      allThemes.value = bundledThemesInfo
      allLanguages.value = bundledLanguagesInfo

      watch(input, run, { immediate: true })

      watch([lang, theme], async (n, o) => {
        isLoading.value = true
        await Promise.all([
          highlighter.loadTheme(theme.value),
          highlighter.loadLanguage(lang.value as any),
        ])
        // Fetch sample if language changed
        if ((o[0] || !input.value) && n[0] !== o[0]) {
          const sample = await fetchSample(lang.value)
          if (sample)
            input.value = sample.replace(/\n.*?From.*?$/im, '').trim()
        }
        run()
      }, { immediate: true })

      function run() {
        output.value = highlighter.codeToHtml(input.value, {
          lang: lang.value,
          theme: theme.value,
          transformers: [
            {
              pre(node) {
                addClassToHast(node, 'vp-code')
                preStyle.value = node.properties?.style as string || ''
              },
            },
          ],
        })
        isLoading.value = false
      }
    })()
  }

  return {
    lang,
    theme,
    allLanguages,
    allThemes,
    input,
    output,
    isLoading,
    preStyle,
    randomize,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayground, import.meta.hot))
