import { warnDeprecated } from './warn'

export { default } from '@shikijs/engine-oniguruma/wasm-inlined'
export * from '@shikijs/engine-oniguruma/wasm-inlined'

warnDeprecated('Import from `@shikijs/engine-oniguruma/wasm-inlined` instead')
