import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';

import { appIcons } from '../icon/icon-registry';
import { NavbarComponent } from './navbar.component';

const translations = {
  'prefs.label': 'Preferences',
  'prefs.appearance': 'Appearance',
  'prefs.language': 'Language',
  'prefs.themeLight': 'Light',
  'prefs.themeDark': 'Dark',
  'nav.docs': 'Docs',
  'nav.components': 'Components',
  'nav.playground': 'Playground',
  'nav.guides': 'Guides',
  'nav.github': 'GitHub',
  'nav.opensInNewTab': 'opens in a new tab',
  'nav.getStarted': 'Get started',
  'nav.primary': 'Primary navigation',
  'nav.mobile': 'Navigation menu',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.skipToContent': 'Skip to content',
};

describe('NavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        provideLucideIcons(...Object.values(appIcons)),
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    }).compileComponents();
  });

  it('marks the overridden active link with aria-current', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentRef.setInput('active', 'docs');
    await fixture.whenStable();

    const links = fixture.nativeElement.querySelectorAll('nav a');
    const current = [...links].filter((link) => link.getAttribute('aria-current') === 'page');

    expect(current).toHaveLength(1);
    expect(current[0].textContent).toContain('Docs');
  });

  it('toggles the mobile disclosure and closes it with Escape', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      'button[aria-controls]:not([aria-haspopup])',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.dispatchEvent(new MouseEvent('click', { detail: 1, bubbles: true }));
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(
      fixture.nativeElement.querySelector(`[id="${button.getAttribute('aria-controls')}"]`),
    ).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });
});
