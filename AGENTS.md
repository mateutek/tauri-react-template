# AGENTS.md

Conventions for agents working in this repo. `README.md` has the file tree and
setup commands — this file covers the rules that aren't visible from the tree.

<!-- template-only -->
## What this repo is

A **template**, scaffolded into real apps by `bin/create.mjs`. Two consequences
that override normal instincts:

- **Every file is example code someone will copy.** A shortcut here gets
  cloned into every generated app. Patterns matter more than features.
- **Don't add dependencies.** The stack below is the budget. A new dep in the
  template is a new dep in every app made from it — justify it or write the
  ten lines instead.

Despite the directory name, this is **React 19**, not Vue.

<!-- /template-only -->
## Stack

 React 19 · Vite 6 · TypeScript (strict) · Tailwind 4 · shadcn/radix ·
zustand · react-router 7 · zod 4 · react-hook-form 7 · Tauri 2.

## Where code goes

| Path | Holds | Rule |
|---|---|---|
| `src/views/` | One component per route | Routed from `App.tsx` only |
| `src/components/` | Shared components | Used by 2+ views, else keep it in the view |
| `src/components/ui/` | shadcn primitives | Add via `npx shadcn@latest add`, don't hand-roll |
| `src/lib/schemas.ts` | Every Zod schema | The app's model layer |
| `src/lib/tauri.ts` | The Rust↔TS boundary | All `invoke`/SQL goes through here |
| `src/lib/utils.ts` | `cn()` only | Not a junk drawer |
| `src/stores/` | zustand stores | Cross-view state only |
| `src-tauri/src/lib.rs` | Commands, plugins, migrations | |

Import with the `@/` alias (`@/lib/schemas`), never `../../lib/schemas`.
No barrel/`index.ts` files — import from the module directly.

## Schemas are the source of truth

Zod schema first, type inferred from it. **Never hand-write a type a schema
already describes**, and never let a schema and an interface describe the same
shape — they drift.

```ts
export const themeModeSchema = z.enum(["light", "dark", "system"]);
export type ThemeMode = z.infer<typeof themeModeSchema>;
```

Schemas live in `src/lib/schemas.ts`. Split it into `src/lib/schemas/` only
once it genuinely hurts.

## Parse at every trust boundary

TypeScript stops at the edges of the app. These four are `any` at runtime and
must be parsed, not cast:

| Boundary | Use |
|---|---|
| Rust commands | `invokeParsed(cmd, schema, args)` |
| SQLite rows | `selectParsed(db, schema, sql, values)` |
| `localStorage` | `schema.safeParse(...)` + fallback |
| Network / files | `schema.parse(...)` |

`safeParse` with a sane default when bad data should degrade (a stale
preference), `parse` when it should fail loudly (a backend contract break).
`JSON.parse` throws on corrupt input — wrap it before the schema sees it. See
`loadProfile()` in `SettingsView.tsx` and `initialMode()` in `themeStore.ts`.

## Forms

`react-hook-form` + `zodResolver`. Never hand-roll validation state.

```tsx
useForm<ProfileInput, unknown, Profile>({
  resolver: zodResolver(profileSchema),
  defaultValues: loadProfile(),
});
```

**Three generics, always** — input type, context, output type. When a schema
transforms (`.trim()`, `"" → undefined`, `string → Date`), what the fields hold
is not what submit receives. Collapsing them to one generic is how untrimmed
strings and empty-string emails reach storage.

Errors render inline and wire `aria-invalid` + `aria-describedby` on the input.
`SettingsView.tsx` is the reference implementation — copy its shape.

## Styling

Tailwind utilities only. Semantic tokens (`bg-card`, `text-muted-foreground`,
`border-destructive`) — **never** raw colors like `bg-white`, or dark mode
breaks. Tokens are OKLCH pairs in `src/assets/base.css`.

Merge classes with `cn()`. Dark mode is the `.dark` class on `<html>`, driven
by `themeStore`; `data-theme` is kept only for backward compat.

## Routing & state

New route = add `<Route>` in `App.tsx` + a view file, and a `BottomBar` link if
it needs nav. `App.tsx` reserves 60px bottom padding for the fixed bar.

`useState` first. Promote to a zustand store only when a second view needs it.
One store per concern, in `src/stores/`.

## Tauri

Rust command → add to `invoke_handler![]` in `lib.rs` → call via `invokeParsed`
with a schema. Permissions belong in `capabilities/default.json`; a missing
permission fails at runtime, not compile time.

SQLite migrations are append-only: bump `version` and add an entry. **Never
edit a migration that has shipped** — it won't re-run on existing installs.

<!-- template-only -->
## Template placeholders

`bin/create.mjs` rewrites `Tauri React Template`, `tauri-react-template`,
`tauri_react_template`, and `com.example.tauri-react-template` — but **only in
the hardcoded `FILES` list** (`package.json`, `index.html`, `tauri.conf.json`,
`Cargo.toml`, `Cargo.lock`, `main.rs`, `BottomBar.tsx`).

Putting the app name in any other file silently ships the template's name into
generated apps. Either derive it from an existing source or add the file to
`FILES`.

<!-- /template-only -->
## Verifying

```bash
npm run build     # tsc --noEmit && vite build — the check that must pass
npm run tauri:dev # desktop shell
```

`strict`, `noUnusedLocals`, and `noUnusedParameters` are on. There is **no test
runner** — don't write test files that nothing executes, and don't add a test
framework without asking.
