# App Template

A reusable starter template for building desktop or web applications with:

- **React 19** + **TypeScript** + **Vite**
- **Tauri 2** (optional — for desktop builds)
- **Zustand** — state management
- **React Router** — client-side routing
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** (New York) components on the **scaffold/ui** design system (Zinc palette, Geist type, OKLCH tokens)
- **lucide-react** — icon library
- **Light / Dark theme** — persisted to localStorage

---

## Project Structure

```
tauri-react-template/
├── bin/
│   └── create.mjs            # Scaffold CLI (stripped from generated projects)
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── components.json            # shadcn/ui config
├── src/
│   ├── main.tsx              # App bootstrap (Router, theme init)
│   ├── App.tsx               # Root shell — <Routes> + <BottomBar>
│   ├── vite-env.d.ts
│   ├── assets/
│   │   ├── base.css          # Tailwind + scaffold/ui tokens (OKLCH, light/.dark)
│   │   └── theme.css         # Base typography defaults
│   ├── components/
│   │   ├── BottomBar.tsx     # Fixed bottom nav: app name, settings link, theme toggle
│   │   └── ui/
│   │       └── button.tsx    # shadcn Button component (all variants)
│   ├── lib/
│   │   └── utils.ts          # cn() utility (clsx + tailwind-merge)
│   ├── stores/
│   │   └── themeStore.ts     # Light/dark theme (Zustand), persisted to localStorage
│   └── views/
│       ├── HomeView.tsx      # Generic home with placeholder card grid
│       └── SettingsView.tsx  # Settings page with theme toggle section
└── src-tauri/                # Tauri desktop wrapper (remove if web-only)
    ├── build.rs
    ├── Cargo.toml
    ├── tauri.conf.json       # App name, identifier, window size, icon paths
    ├── capabilities/
    │   └── default.json      # FS + SQL permissions
    ├── app-icon.png          # 1024px source icon — regen with `npx tauri icon`
    ├── icons/                # Generated app icons (all platforms)
    └── src/
        ├── main.rs           # Rust entry point
        └── lib.rs            # Tauri builder: plugins, commands, SQLite migrations
```

---

## Quick Start

Scaffolding copies the full template, renames every placeholder to your app name, and strips the CLI tooling from the generated project — all in one command.

### From GitHub

```bash
npx github:<your-username>/tauri-react-template my-app
# with a custom output path:
npx github:<your-username>/tauri-react-template my-app ./projects/my-app
```

### Locally (no GitHub required)

```bash
# run directly from the local template path:
npx /path/to/tauri-react-template my-app
npx /path/to/tauri-react-template my-app ./projects/my-app
```

Or install once as a global command with `npm link`:

```bash
cd /path/to/tauri-react-template
npm link
```

Then from anywhere on your machine:

```bash
tauri-react-template my-app
tauri-react-template my-app ./projects/my-app
```

### After scaffolding

```bash
cd my-app
npm install              # or: bun install / pnpm install
npm run tauri:dev        # desktop (requires Rust + Tauri CLI)
npm run dev              # web-only
```

> **Desktop prerequisites:** Rust + Tauri CLI — https://tauri.app/start/prerequisites/
>
> **App icons:** `npx tauri icon path/to/icon.png` generates all required sizes into `src-tauri/icons/`.

---

## Customisation Checklist

All identifiers are renamed automatically by the scaffold command. After creating a new project the only manual steps are:

### Add Routes
Add a `<Route>` in `src/App.tsx` and a new view under `src/views/`.

### Add a Zustand Store
Create `src/stores/myStore.ts` using `create` from `zustand`.

### Add UI Components
Use the shadcn CLI to scaffold additional components into `src/components/ui/`:
```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add select
```

### Add Tauri Commands (Rust → React)
1. Add a `#[tauri::command]` function in `src-tauri/src/lib.rs`
2. Register it in `.invoke_handler(tauri::generate_handler![your_command])`
3. Call it from React with `import { invoke } from '@tauri-apps/api/core'`

### Add SQLite Migrations
Extend the `add_migrations("sqlite:app.db", vec![...])` block in `src-tauri/src/lib.rs`.

### Remove Tauri (Web-only Build)
- Delete `src-tauri/`
- Remove `@tauri-apps/*` packages from `package.json`
- Remove `tauri`, `tauri:dev`, `tauri:build` scripts from `package.json`
- Restore the simple `vite.config.ts` (remove `clearScreen` / `server` block)

---

## Tech Stack Versions

| Package | Version |
|---|---|
| React | ^19.1 |
| Vite | ^6.0 |
| TypeScript | ~5.6 |
| Tauri | ^2 |
| Zustand | ^5.0 |
| React Router | ^7.6 |
| Tailwind CSS | ^4.0 |
| radix-ui | ^1.5 |
| lucide-react | ^0.563 |
