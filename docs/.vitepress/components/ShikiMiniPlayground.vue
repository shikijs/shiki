<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { usePlayground } from '../store/playground'
import FundingButton from './FundingButton.vue'

const play = usePlayground()
const currentLang = computed(() => play.allLanguages.find(i => i.name === play.lang))
const currentTheme = computed(() => play.allThemes.find(i => i.name === play.theme))

const textAreaRef = ref<HTMLDivElement>()
const highlightContainerRef = ref<HTMLSpanElement>()

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
</script>

<template>
  <div
    class="language-ts vp-adaptive-theme transition-none! mini-playground" shadow
    :style="[play.preStyle, { colorScheme: currentTheme?.type || 'inherit' }]"
  >
    <div sticky z-12 p2 px3 pl5 flex="~ gap-4 items-center" left-0 top-0 right-0 border="b-solid gray/5" bg-inherit>
      <label relative flex="~ gap-1 items-center" justify-start class="min-w-[8em]">
        <div i-carbon:chevron-down op50 />
        <span font-mono text-xs>{{ currentLang?.name }}</span>
        <select v-model="play.lang" font-mono :style="play.preStyle" absolute inset-0 min-w-0 op0>
          <option v-for="lang in play.allLanguages" :key="lang.name" :value="lang.name">
            {{ lang.name }}
          </option>
        </select>
        <FundingButton :name="`${currentLang?.displayName} grammar`" :funding="currentLang?.funding" />
      </label>
      <label relative flex="~ gap-1 items-center" justify-start class="min-w-[8em]">
        <div i-carbon:chevron-down op50 />
        <span font-mono text-xs>{{ currentTheme?.displayName }}</span>
        <select v-model="play.theme" font-mono :style="play.preStyle" absolute inset-0 min-w-0 op0>
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
      <div flex-auto />
      <div
        i-svg-spinners-3-dots-fade
        :class="play.isLoading ? 'op100' : 'op0'"
        flex-none transition-opacity
      />
      <a op50 text-xs mx-2 hover="op75" href="https://textmate-grammars-themes.netlify.app/" target="_blank" title="Full Playground" class="decoration-none! text-inherit!">
        Playground
      </a>
      <button title="Randomize" hover="bg-gray/10" p1 rounded @click="play.randomize">
        <div i-carbon:shuffle op50 />
      </button>
    </div>
    <div relative min-h-100 float-left min-w-full>
      <span ref="highlightContainerRef" v-html="play.output" />
      <textarea
        ref="textAreaRef"
        v-model="play.input"
        whitespace-pre overflow-auto w-full h-full
        font-mono bg-transparent absolute inset-0 py-20px px-24px
        text-transparent caret-gray tab-4 resize-none z-10
        class="line-height-$vp-code-line-height font-$vp-font-family-mono text-size-$vp-code-font-size"
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
