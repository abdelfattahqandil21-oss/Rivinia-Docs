import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const root = document.documentElement;

  beforeEach(() => {
    root.removeAttribute('data-rv-theme');
    localStorage.removeItem('rv-theme');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    root.removeAttribute('data-rv-theme');
    localStorage.removeItem('rv-theme');
  });

  it('defaults to light without a stored choice', () => {
    const themeService = TestBed.inject(ThemeService);

    expect(themeService.theme()).toBe('light');
    expect(root.getAttribute('data-rv-theme')).toBe('light');
  });

  it('uses the existing root theme when initialized', () => {
    root.setAttribute('data-rv-theme', 'dark');

    const themeService = TestBed.inject(ThemeService);

    expect(themeService.theme()).toBe('dark');
  });

  it('restores a stored choice over the root theme', () => {
    root.setAttribute('data-rv-theme', 'light');
    localStorage.setItem('rv-theme', 'dark');

    const themeService = TestBed.inject(ThemeService);

    expect(themeService.theme()).toBe('dark');
  });

  it('sets the root theme, updates its signal and remembers the choice', () => {
    const themeService = TestBed.inject(ThemeService);

    themeService.setTheme('dark');

    expect(root.getAttribute('data-rv-theme')).toBe('dark');
    expect(themeService.theme()).toBe('dark');
    expect(localStorage.getItem('rv-theme')).toBe('dark');
  });

  it('toggles between dark and light', () => {
    const themeService = TestBed.inject(ThemeService);

    themeService.toggleTheme();
    expect(root.getAttribute('data-rv-theme')).toBe('dark');
    expect(themeService.theme()).toBe('dark');

    themeService.toggleTheme();
    expect(root.getAttribute('data-rv-theme')).toBe('light');
    expect(themeService.theme()).toBe('light');
  });
});
