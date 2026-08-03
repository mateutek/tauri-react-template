import { create } from 'zustand';
import { themeModeSchema, type ResolvedTheme, type ThemeMode } from '@/lib/schemas';

export type { ResolvedTheme, ThemeMode };

const mql = () => window.matchMedia('(prefers-color-scheme: dark)');
const systemResolved = (): ResolvedTheme => (mql().matches ? 'dark' : 'light');
const resolveMode = (mode: ThemeMode): ResolvedTheme =>
  mode === 'system' ? systemResolved() : mode;

// scaffold/ui scopes dark mode on the `.dark` class; we also keep the
// legacy `data-theme` attribute for backward compat.
const applyResolved = (resolved: ResolvedTheme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.setAttribute('data-theme', resolved);
};

// localStorage is untrusted input — a stale or hand-edited value falls back
// to 'system' rather than putting a bogus mode into the store.
const initialMode = (): ThemeMode =>
  themeModeSchema.safeParse(localStorage.getItem('theme')).data ?? 'system';

interface ThemeState {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const mode = initialMode();
  return {
    mode,
    resolved: resolveMode(mode),
    setMode: (mode) => {
      localStorage.setItem('theme', mode);
      const resolved = resolveMode(mode);
      applyResolved(resolved);
      set({ mode, resolved });
    },
  };
});

// Apply the saved/preferred theme and react to OS changes while in `system`.
let bound = false;
export const initTheme = () => {
  applyResolved(useThemeStore.getState().resolved);
  if (bound) return;
  bound = true;
  mql().addEventListener('change', () => {
    if (useThemeStore.getState().mode !== 'system') return;
    const resolved = systemResolved();
    applyResolved(resolved);
    useThemeStore.setState({ resolved });
  });
};
