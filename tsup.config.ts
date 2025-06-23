import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  shims: true,
  splitting: false,
  target: 'node18',
  outDir: 'dist',
  banner: {
    js: `#!/usr/bin/env node`
  }
})