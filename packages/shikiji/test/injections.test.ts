import { codeToHtml, getHighlighterCore } from 'shikiji'
import { expect, it } from 'vitest'
import vl from '../src/assets/themes/vitesse-light'
import html from '../src/assets/langs/html'
import vue from '../src/assets/langs/vue'
import ts from '../src/assets/langs/typescript'
import angularHtml from '../src/assets/langs/angular-html'
import angularTs from '../src/assets/langs/angular-ts'

// Basically we need to make sure that the syntax inside `v-if` and `{{}}` is highlighted correctly.
// This is done by a `vue-injections` patch that injects extra grammar into HTML.
it('vue-injections', async () => {
  const code = `
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div>
    <h1 v-if="count == 1 ? true : 'str'.toUpperCase()">{{ count * 2 }}</h1>
  </div>
</template>
`

  expect(`${await codeToHtml(code, { lang: 'vue', theme: 'vitesse-dark' })}<style>html{color-scheme:dark}</style>`)
    .toMatchFileSnapshot('./out/vue-injections.html')
})

it('injections-side-effects vue', async () => {
  const highlighter = await getHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      html,
    ],
  })

  const code = `<h1 v-if="count == 1 ? true : 'str'.toUpperCase()">{{ count * 2 }}</h1>`

  const before = highlighter.codeToHtml(code, { lang: 'html', theme: 'vitesse-light' })
  expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-vue-before.html')

  await highlighter.loadLanguage(vue)

  const after = highlighter.codeToHtml(code, { lang: 'vue', theme: 'vitesse-light' })
  expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-vue-after.html')

  expect(before).not.toEqual(after)
})

it('injections-side-effects angular-html', async () => {
  const highlighter = await getHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      html,
    ],
  })

  const code = `<div [ ngStyle ]="{'max-width.px': i * 2 + 5}"></div>`

  const before = highlighter.codeToHtml(code, { lang: 'html', theme: 'vitesse-light' })
  expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-before.html')

  await highlighter.loadLanguage(angularHtml)

  const after = highlighter.codeToHtml(code, { lang: 'angular-html', theme: 'vitesse-light' })
  expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-after.html')

  expect(before).not.toEqual(after)
})

it('injections-side-effects angular-ts', async () => {
  const highlighter = await getHighlighterCore({
    themes: [
      vl,
    ],
    langs: [
      ts,
    ],
  })

  const code = `
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-button',
  standalone: true,
  imports: [RouterLink],
  template: \`
    <button
      type="button"
      [routerLink]="'/cart'"
    >
      @if (cartService.length > 0) {
        <div>
          {{ cartService.length }}
        </div>
      }
      Cart
    </button>
  \`,
  styles: \`div {display: block;}\`,
})
export class CartButtonComponent {
  protected cartService = inject(CartService);
}
`

  const before = highlighter.codeToHtml(code, { lang: 'ts', theme: 'vitesse-light' })
  expect(before)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-ts-before.html')

  await highlighter.loadLanguage(angularTs)

  const after = highlighter.codeToHtml(code, { lang: 'angular-ts', theme: 'vitesse-light' })
  expect(after)
    .toMatchFileSnapshot('./out/injections-side-effects-angular-ts-after.html')

  expect(before).not.toEqual(after)
})
