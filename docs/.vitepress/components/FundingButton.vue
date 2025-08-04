<script setup lang="ts">
import type { FundingLink } from 'tm-grammars'

defineProps<{
  funding: FundingLink[] | undefined
  name: string
}>()
</script>

<template>
  <div
    v-if="funding && funding.length > 0"
    class="group"
    relative inline-block
  >
    <button
      title="Funding"
      hover="bg-gray/10"
      p1 rounded
    >
      <div
        i-carbon:favorite-filled text="red-500"
        op50 group-hover:op100 group-focus-within:op100
        transition-opacity duration-250 class="ease-[step-end] group-hover:ease-[step-start] group-focus-within:ease-[step-start]"
      />
    </button>

    <div
      class="ease-[step-end] group-hover:ease-[step-start] group-focus-within:ease-[step-start] transition-[opacity,visibility]"
      absolute top-full left-0 z-1
      bg-white border="~ solid gray-200"
      p3 text="xs"
      rounded shadow-xl
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      group-focus-within:opacity-100 group-focus-within:visible
      duration-250
      text-nowrap
    >
      <strong block mb-2>Support {{ name }} development:</strong>
      <div
        v-for="link, i in funding"
        :key="i"
        text-nowrap
      >
        <template v-if="link.handle">
          {{ link.name }}:
        </template>
        <a :href="link.url" target="_blank">{{ link.handle || link.name }}</a>
      </div>
    </div>
  </div>
</template>
