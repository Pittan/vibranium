#!/usr/bin/env node

import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Development mode - run from source
const devMode = process.env.NODE_ENV === 'development' || 
                !require('node:fs').existsSync(join(__dirname, '../dist'))

async function main() {
  if (devMode) {
    // In development, use tsx to run TypeScript directly
    try {
      await import('tsx')
      const { run } = await import('../src/index.ts')
      await run(process.argv.slice(2))
    } catch (error) {
      console.error('Development mode requires tsx. Install it with: npm install -D tsx')
      process.exit(1)
    }
  } else {
    // In production, use compiled JavaScript
    const { run } = await import('../dist/index.js')
    await run(process.argv.slice(2))
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})