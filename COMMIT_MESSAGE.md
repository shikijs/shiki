# Commit Message

```
fix(types): add missing TypeScript declarations for subpath exports

Add proper type declarations for subpath exports in engine packages:
- @shikijs/engine-oniguruma: Add types for ./wasm-inlined export
- @shikijs/engine-javascript: Add types for ./raw export

This fixes TypeScript errors when importing these subpaths:
- Cannot find module '@shikijs/engine-oniguruma/wasm-inlined'
- Cannot find module '@shikijs/engine-javascript/raw'

The exports field now properly includes both 'types' and 'default' fields
for each subpath, following Node.js package exports best practices.

Fixes TypeScript compilation errors in:
- bench/bundle-test/index-lite.ts
- bench/bundle-test/index-wasm.ts
- packages/codegen/test/__snapshots__/basic-precompiled.ts
- packages/core/test/core.test.ts
- packages/engine-javascript/test/compare.test.ts
- packages/shiki/src/wasm.ts
- packages/shiki/test/get-highlighter.test.ts
```
