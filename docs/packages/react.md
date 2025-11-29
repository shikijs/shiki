# React

[react-shiki](https://github.com/kaidesu/react-shiki) is a client-side Shiki integration for React.

At 0.8.0, it's growing fast with 16k+ weekly downloads and has proven reliable and performant in production apps like [t3.chat](https://t3.chat) and powers syntax highlighting in [assistant-ui](https://github.com/assistant-ui/assistant-ui), a Typescript SDK and React component library for AI chat.

## Install

::: code-group

```sh [npm]
npm i react-shiki
```

```sh [yarn]
yarn add react-shiki
```

```sh [pnpm]
pnpm add react-shiki
```

```sh [bun]
bun add react-shiki
```

:::

## Usage

```tsx
import { Shiki } from 'react-shiki'

function App() {
  return (
    <Shiki
      code='console.log("Hello World")'
      lang='ts'
      theme='vitesse-dark'
    />
  )
}
```
