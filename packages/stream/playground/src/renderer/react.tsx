import type { JSX } from 'react'
import type { Root } from 'react-dom/client'
/* eslint-disable no-console */
import type { RendererFactory, RendererFactoryResult } from './types'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { shallowReactive, watch } from 'vue'
import { ShikiStreamRenderer } from '../../../src/react'

export const createRendererReact: RendererFactory = (options): RendererFactoryResult => {
  let app: Root | undefined

  const props = shallowReactive<any>({
    onStreamStart: options.onStart,
    onStreamEnd: options.onEnd,
  })

  function App(): JSX.Element {
    const [count, setCounter] = React.useState(0)

    React.useEffect(() => {
      return watch(props, () => {
        // Force React to re-render
        setCounter(c => c + 1)
      })
    }, [])

    console.log('React rendering', count)

    const [i, setI] = React.useState(0)

    React.useEffect(() => {
      const timerId = setInterval(() => {
        setI(i => i + 1)
      }, 1_000)
      return () => clearInterval(timerId)
    }, [])

    return (
      <ShikiStreamRenderer
        {...props}
        onStreamStart={() => {
          console.log('onStreamStart', i)
          props.onStreamStart?.()
        }}
        onStreamEnd={() => {
          console.log('onStreamEnd', i)
          props.onStreamEnd?.()
        }}
        className={props.class}
      />
    )
  }

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      app = ReactDOM.createRoot(element)
      app.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )

      console.log('React renderer mounted')
    },

    update: (payload) => {
      Object.assign(props, payload)
    },

    dispose: () => {
      app?.unmount()
      app = undefined
    },
  }
}
