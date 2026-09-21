import { Injectable, computed, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const STORAGE_KEY = 'lumina.theme';

function readStoredTheme(): AppTheme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    // ignore
  }
  return null;
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDomTheme(theme: AppTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeState = signal<AppTheme>(readStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light'));

  readonly theme = this.themeState.asReadonly();
  readonly isDark = computed(() => this.themeState() === 'dark');

  constructor() {
    applyDomTheme(this.themeState());
  }

  setTheme(theme: AppTheme): void {
    if (this.themeState() === theme) {
      applyDomTheme(theme);
      return;
    }
    this.themeState.set(theme);
    applyDomTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }

  toggleTheme(): void {
    this.setTheme(this.themeState() === 'dark' ? 'light' : 'dark');
  }
}
