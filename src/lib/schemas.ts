import { z } from "zod";

// Single source of truth for the app's models: schemas here, types inferred
// from them. Never hand-write a type that a schema already describes.

// Theme --------------------------------------------------------------------

// User preference. `system` follows the OS color scheme.
export const themeModeSchema = z.enum(["light", "dark", "system"]);
export type ThemeMode = z.infer<typeof themeModeSchema>;

// Actually applied scheme.
export const resolvedThemeSchema = z.enum(["light", "dark"]);
export type ResolvedTheme = z.infer<typeof resolvedThemeSchema>;

// Profile ------------------------------------------------------------------

export const profileSchema = z.object({
  // `.trim()` runs on parse, so the submitted payload is already clean.
  displayName: z.string().trim().min(2, "At least 2 characters").max(40),
  // Empty input is valid and transforms to `undefined` rather than "" —
  // input type and output type deliberately differ here.
  email: z
    .union([z.literal(""), z.email("Enter a valid email")])
    .transform((v) => v || undefined),
});

// What the form fields hold vs. what a successful submit hands you.
export type ProfileInput = z.input<typeof profileSchema>;
export type Profile = z.output<typeof profileSchema>;
