import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const outDir = path.join(root, 'out')
const distDir = path.join(root, 'dist')

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

if (!(await exists(outDir))) {
  throw new Error(`Expected Next export output at ${outDir}`)
}

await fs.rm(distDir, { recursive: true, force: true })
await fs.rename(outDir, distDir)

// GitHub Pages / custom domains
const cnameSrc = path.join(root, 'CNAME')
if (await exists(cnameSrc)) {
  await fs.copyFile(cnameSrc, path.join(distDir, 'CNAME'))
}

// Ensure GitHub Pages doesn't try to run Jekyll
await fs.writeFile(path.join(distDir, '.nojekyll'), '')

