/**
 * Preferences menu (shared/components/preferences-menu).
 *
 * WHAT: one header trigger that opens a small popover holding the two
 *   site-wide preferences — appearance and language.
 * WHO USES IT: the navbar, beside the account-free controls.
 * WHEN/WHY: two separate toggles made the header read as a toolbar; one
 *   "preferences" control keeps the page links dominant and gives the choices
 *   room to be labelled. It is a non-modal popover: focus stays on the trigger
 *   until the visitor tabs in, Escape closes and returns focus, and an outside
 *   pointer closes it.
 *
 * Language names come from the i18n language list (native names), never from
 * translated keys, so every language always reads in its own script.
 */

import { Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import type { ThemeMode } from '../../../core/models/theme-mode.model';
import { RevealTransitionService } from '../../../core/services/reveal-transition.service';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../icon/icon.component';
import type { AppIconName } from '../icon/icon-registry';

type AppLanguage = 'ar' | 'en';

interface ThemeOption {
  readonly value: ThemeMode;
  readonly icon: AppIconName;
  readonly labelKey: string;
}

const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: 'light', icon: 'sun', labelKey: 'prefs.themeLight' },
  { value: 'dark', icon: 'moon', labelKey: 'prefs.themeDark' },
];

let nextPreferencesMenuId = 0;

@Component({
  imports: [IconComponent],
  selector: 'app-preferences-menu',
  templateUrl: './preferences-menu.component.html',
  styleUrl: './preferences-menu.component.css',
  host: {
    '(document:keydown.escape)': 'onEscape()',
    '(document:pointerdown)': 'onPointerDown($event)',
  },
})
export class PreferencesMenuComponent {
  protected readonly i18n = inject<RiviniaI18n<AppLanguage>>(RiviniaI18n);

  private readonly themeService = inject(ThemeService);
  private readonly reveal = inject(RevealTransitionService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  protected readonly panelId = `rv-preferences-${nextPreferencesMenuId++}`;
  protected readonly themeGroupId = `${this.panelId}-appearance`;
  protected readonly languageGroupId = `${this.panelId}-language`;

  /** Emitted when the panel opens, so the navbar can dismiss its own panel. */
  readonly opened = output<void>();

  protected readonly open = signal(false);
  private nextRevealDirection: 'expand' | 'collapse' = 'expand';
  /** A dictionary is loading before the switch; language rows stay disabled. */
  protected readonly switching = signal(false);

  protected readonly theme = this.themeService.theme;
  protected readonly currentLanguage = this.i18n.currentLanguage;
  protected readonly languages = this.i18n.languages;
  protected readonly themeOptions = THEME_OPTIONS;

  protected readonly triggerLabel = this.i18n.t('prefs.label');
  protected readonly appearanceLabel = this.i18n.t('prefs.appearance');
  protected readonly languageLabel = this.i18n.t('prefs.language');

  protected toggle(): void {
    const open = !this.open();
    this.open.set(open);

    if (open) {
      this.opened.emit();
    }
  }

  protected close(): void {
    this.open.set(false);
  }

  protected selectTheme(theme: ThemeMode, event: MouseEvent): void {
    if (theme === this.theme()) {
      return;
    }

    const origin = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    this.reveal.run(origin, () => this.themeService.setTheme(theme), this.nextRevealDirection);
    this.nextRevealDirection = this.nextRevealDirection === 'expand' ? 'collapse' : 'expand';
  }

  protected selectLanguage(id: AppLanguage, event: MouseEvent): void {
    if (id === this.currentLanguage() || this.switching()) {
      this.close();
      return;
    }

    const origin = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    this.switching.set(true);

    // Preload first: a failed dictionary keeps the panel, the language and the
    // direction untouched instead of flashing raw keys mid-reveal.
    void this.i18n.loadTranslations(id).then(
      () => {
        this.switching.set(false);

        if (this.i18n.loadingState() === 'error') {
          return;
        }

        this.reveal.run(origin, () => {
          this.i18n.setLanguage(id);
          this.close();
          this.trigger()?.nativeElement.focus();
        }, this.nextRevealDirection);
        this.nextRevealDirection = this.nextRevealDirection === 'expand' ? 'collapse' : 'expand';
      },
      () => this.switching.set(false),
    );
  }

  protected onEscape(): void {
    if (!this.open()) {
      return;
    }

    this.close();
    this.trigger()?.nativeElement.focus();
  }

  protected onPointerDown(event: Event): void {
    if (!this.open()) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !this.host.nativeElement.contains(target)) {
      this.close();
    }
  }

}
