export type Awaitable<T> = T | Promise<T>
export type MaybeGetter<T> = Awaitable<MaybeModule<T>> | (() => Awaitable<MaybeModule<T>>)
export type MaybeModule<T> = T | { default: T }
export type MaybeArray<T> = T | T[]
export type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

interface Nothing { }

/**
 * type StringLiteralUnion<'foo'> = 'foo' | string
 * This has auto completion whereas `'foo' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & Nothing)
