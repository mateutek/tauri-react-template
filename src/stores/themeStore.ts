import { create } from 'zustand';

export type Theme = 'light' | 'dark';

// scaffold/ui scopes dark mode on the `.dark` class; we also keep the
// legacy `data-theme` attribute for backward compat.
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

const initialTheme = (): Theme => {
  const saved = localStorage.getItem('theme') as Theme | null;
  if (saved) return saved;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
};

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    set({ theme: next });
  },
}));

// Apply the saved/preferred theme to the document on load.
export const initTheme = () => applyTheme(useThemeStore.getState().theme);
