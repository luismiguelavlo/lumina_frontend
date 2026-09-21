import { Injectable, computed, signal } from '@angular/core';
import type { AppLocale, TranslationDictionary } from './i18n.models';
import { TRANSLATIONS_EN } from './translations.en';
import { TRANSLATIONS_ES } from './translations.es';

const STORAGE_KEY = 'lumina.locale';

const DICTS: Record<AppLocale, TranslationDictionary> = {
  en: TRANSLATIONS_EN,
  es: TRANSLATIONS_ES,
};

function readStoredLocale(): AppLocale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'en' || raw === 'es') return raw;
  } catch {
    // ignore (SSR / private mode)
  }
  return 'en';
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly localeState = signal<AppLocale>(readStoredLocale());

  readonly locale = this.localeState.asReadonly();
  readonly isSpanish = computed(() => this.localeState() === 'es');

  t(key: string): string {
    const dict = DICTS[this.localeState()];
    return dict[key] ?? DICTS.en[key] ?? key;
  }

  setLocale(locale: AppLocale): void {
    if (this.localeState() === locale) return;
    this.localeState.set(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }

  toggleLocale(): void {
    this.setLocale(this.localeState() === 'en' ? 'es' : 'en');
  }
}
