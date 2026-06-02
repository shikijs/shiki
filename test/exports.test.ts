import yaml from 'js-yaml'
import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'
import { getPackageExportsManifest } from 'vitest-package-exports'

describe('exports-snapshot', async () => {
  const packages: { name: string, path: string, private?: boolean }[] = JSON.parse(
    await x('pnpm', ['ls', '--only-projects', '-r', '--json']).then(r => r.stdout),
  )

  for (const pkg of packages) {
    if (pkg.private)
      continue
    if (pkg.name === '@shikijs/themes' || pkg.name === '@shikijs/langs' || pkg.name === '@shikijs/langs-precompiled')
      continue
    it(`${pkg.name}`, async () => {
      const manifest = await getPackageExportsManifest({
        importMode: 'src',
        cwd: pkg.path,
        resolveExportEntries(entries) {
          // Framework-adapter subpaths require framework toolchains (Solid babel preset, Svelte
          // compiler, React JSX transform, etc.) that the root vitest env does not load. The
          // built artifacts are still validated by `pnpm -r run build`.
          const FRAMEWORK_SUBPATHS = new Set(['./vue', './react', './solid', './svelte'])
          return entries.filter(([path]) => {
            if (path === './cli')
              return false
            if (path.endsWith('.css') || path.endsWith('.wasm'))
              return false
            if (FRAMEWORK_SUBPATHS.has(path))
              return false
            // @shikijs/magic-move's bare entry throws by design to redirect users to subpaths.
            if (pkg.name === '@shikijs/magic-move' && path === '.')
              return false
            return true
          })
        },
      })
      await expect(yaml.dump(manifest.exports, { sortKeys: (a, b) => a.localeCompare(b) }))
        .toMatchFileSnapshot(`./exports/${pkg.name}.yaml`)
    })
  }
})
