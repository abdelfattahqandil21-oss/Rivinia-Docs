import { DOCUMENT } from '@angular/common';
import { inject, signal, Service } from '@angular/core';

import type { ThemeMode } from '../models/theme-mode.model';

export type { ThemeMode } from '../models/theme-mode.model';

/** Where the visitor's explicit choice is remembered. */
const THEME_STORAGE_KEY = 'rv-theme';

/**
 * Theme state and the root `data-rv-theme` attribute.
 *
 * Dark is the default: the site does not follow the OS colour scheme, so a
 * first visit is predictable. An explicit choice wins and is restored later.
 */
@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly themeState = signal<ThemeMode>(this.getInitialTheme());

  readonly theme = this.themeState.asReadonly();

  constructor() {
    this.document.documentElement.setAttribute('data-rv-theme', this.themeState());
  }

  setTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-rv-theme', theme);
    this.themeState.set(theme);
    this.storeTheme(theme);
  }

  toggleTheme(): void {
    this.setTheme(this.themeState() === 'dark' ? 'light' : 'dark');
  }

  private getInitialTheme(): ThemeMode {
    const stored = this.readStoredTheme();
    if (stored) {
      return stored;
    }

    const rootTheme = this.document.documentElement.getAttribute('data-rv-theme');
    if (rootTheme === 'light' || rootTheme === 'dark') {
      return rootTheme;
    }

    return 'dark';
  }

  private readStoredTheme(): ThemeMode | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      // Storage can be blocked (private mode, third-party cookie rules).
      return null;
    }
  }

  private storeTheme(theme: ThemeMode): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // A remembered choice is a nicety; the theme still applies this session.
    }
  }
}
