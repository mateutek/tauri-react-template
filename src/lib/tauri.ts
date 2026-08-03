import { invoke } from "@tauri-apps/api/core";
import type Database from "@tauri-apps/plugin-sql";
import type { ZodType } from "zod";

// The Rust <-> TS boundary is `any` at runtime: `invoke` and `db.select` will
// happily hand back whatever the backend actually sent, however stale the TS
// types are. Route both through a schema so a shape change fails loudly here
// instead of silently downstream.

/** `invoke`, with the result parsed through `schema`. Throws ZodError on mismatch. */
export async function invokeParsed<T>(
  cmd: string,
  schema: ZodType<T>,
  args?: Record<string, unknown>,
): Promise<T> {
  return schema.parse(await invoke(cmd, args));
}

/** `db.select`, with every row parsed through `schema`. Throws ZodError on mismatch. */
export async function selectParsed<T>(
  db: Database,
  schema: ZodType<T>,
  query: string,
  values?: unknown[],
): Promise<T[]> {
  return schema.array().parse(await db.select(query, values));
}
