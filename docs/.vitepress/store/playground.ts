/// <reference types="vite/client" />

import type { BundledLanguage, BundledTheme } from 'shiki'
import type { GrammarInfo } from 'tm-grammars'
import type { ThemeInfo } from 'tm-themes'
import { useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, shallowRef, watch } from 'vue'

export const usePlayground = defineStore('playground', () => {
  const lang = useLocalStorage<BundledLanguage>('shiki-playground-lang', 'typescript')
  const theme = useLocalStorage<BundledTheme>('shiki-playground-theme', 'vitesse-dark')
  const allThemes = shallowRef<ThemeInfo[]>([])
  const allLanguages = shallowRef<GrammarInfo[]>([])
  const bundledLangsFull = shallowRef<GrammarInfo[]>([])
  const bundledLangsWeb = shallowRef<GrammarInfo[]>([])

  const input = useLocalStorage('shiki-playground-input', '')
  const output = ref('<pre></pre>')
  const preStyle = ref('')
  const isLoading = ref(true)

  function randomize(): void {
    if (allLanguages.value.length && allThemes.value.length) {
      lang.value = allLanguages.value[Math.floor(Math.random() * allLanguages.value.length)].name as BundledLanguage
      theme.value = allThemes.value[Math.floor(Math.random() * allThemes.value.length)].name as BundledTheme
    }
  }

  ;(async () => {
    const { createHighlighter } = await import('shiki')
    const allGrammars = await import('tm-grammars')
    const webGrammars = allGrammars.grammars.filter(grammar => grammar.categories?.includes('web'))
    const { themes: bundledThemesInfo } = await import('tm-themes')

    const samplesCache = new Map<string, Promise<string | undefined>>()

    function fetchSample(id: string): Promise<string | undefined> {
      if (!samplesCache.has(id)) {
        samplesCache.set(id, fetch(`https://raw.githubusercontent.com/shikijs/textmate-grammars-themes/main/samples/${id}.sample`)
          .then(r => r.text())
          .catch((e) => {
            console.error(e)
            return undefined
          }))
      }
      return samplesCache.get(id)!
    }

    allThemes.value = bundledThemesInfo
    allLanguages.value = allGrammars.grammars
    bundledLangsFull.value = allGrammars.grammars
    bundledLangsWeb.value = webGrammars

    if (typeof window !== 'undefined') {
      const highlighter = await createHighlighter({
        themes: [theme.value],
        langs: ['typescript', 'javascript', lang.value as any],
      })

      watch(input, run, { immediate: true })

      watch([lang, theme], async (n, o) => {
        isLoading.value = true
        await Promise.all([
          highlighter.loadTheme(theme.value),
          highlighter.loadLanguage(lang.value),
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
