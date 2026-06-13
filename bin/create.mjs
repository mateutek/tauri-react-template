#!/usr/bin/env node
/**
 * Scaffold a new project from tauri-react-template.
 *
 * Usage:
 *   npx github:<user>/tauri-react-template <project-name> [directory]
 *
 * Examples:
 *   npx github:yourname/tauri-react-template my-app
 *   npx github:yourname/tauri-react-template my-app ./projects/my-app
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname, sep } from 'path'
import { fileURLToPath } from 'url'

// ── args ──────────────────────────────────────────────────────────────────────

const [,, name, destArg] = process.argv

if (!name) {
  console.error('\nUsage: npx github:<user>/tauri-react-template <project-name> [directory]\n')
  process.exit(1)
}

// ── derive name variants ──────────────────────────────────────────────────────

const kebab = name
  .toLowerCase().trim()
  .replace(/\s+/g,      '-')
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g,       '-')
  .replace(/^-|-$/g,    '')

const snake = kebab.replace(/-/g, '_')
const title = kebab.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
const id    = `com.example.${kebab}`

// ── paths ─────────────────────────────────────────────────────────────────────

const TMPL = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dest = resolve(destArg || kebab)

if (existsSync(dest)) {
  console.error(`\nError: "${dest}" already exists.\n`)
  process.exit(1)
}

// ── copy ──────────────────────────────────────────────────────────────────────

const SKIP = new Set(['bin', 'node_modules', 'dist', '.git', '.vite'])

console.log(`\nCreating ${title} …\n`)

mkdirSync(dest, { recursive: true })

cpSync(TMPL, dest, {
  recursive: true,
  filter(src) {
    const rel = src.slice(TMPL.length).replace(/^[/\\]/, '')
    if (!rel) return true
    // skip top-level dirs that shouldn't ship with the project
    if (SKIP.has(rel.split(/[/\\]/)[0])) return false
    // skip src-tauri/target (deep exclusion)
    if (rel.startsWith(`src-tauri${sep}target`) || rel.startsWith('src-tauri/target')) return false
    return true
  },
})

// ── placeholder replacements ──────────────────────────────────────────────────

const TPL_ID    = 'com.example.tauri-react-template'
const TPL_TITLE = 'Tauri React Template'
const TPL_SNAKE = 'tauri_react_template'
const TPL_KEBAB = 'tauri-react-template'

function rename(s) {
  return s
    .replace(new RegExp(TPL_ID,              'g'), id)
    .replace(new RegExp(TPL_TITLE,           'g'), title)
    .replace(new RegExp(`${TPL_SNAKE}_lib`,  'g'), `${snake}_lib`)
    .replace(new RegExp(TPL_SNAKE,           'g'), snake)
    .replace(new RegExp(TPL_KEBAB,           'g'), kebab)
}

function replaceInFile(rel) {
  const abs = resolve(dest, rel)
  let src
  try { src = readFileSync(abs, 'utf8') } catch { return }
  const out = rename(src)
  if (out !== src) {
    writeFileSync(abs, out, 'utf8')
    console.log(`  ✓  ${rel}`)
  }
}

const FILES = [
  'package.json',
  'index.html',
  'src-tauri/tauri.conf.json',
  'src-tauri/Cargo.toml',
  'src-tauri/Cargo.lock',
  'src-tauri/src/main.rs',
  'src/components/BottomBar.tsx',
]

for (const f of FILES) replaceInFile(f)

// strip the "bin" field so the generated project isn't a CLI tool itself
const pkgPath = resolve(dest, 'package.json')
try {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  delete pkg.bin
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
} catch { /* best-effort */ }

// ── done ──────────────────────────────────────────────────────────────────────

const rel = destArg || kebab
console.log(`
✅  Done!

  cd ${rel}
  npm install          # or: bun install / pnpm install
  npm run tauri:dev    # desktop (requires Rust + Tauri CLI)
  npm run dev          # web-only
`)

