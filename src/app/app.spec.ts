import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLucideIcons } from '@lucide/angular';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';

import { App } from './app';
import { appIcons } from './shared/components/icon/icon-registry';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideLucideIcons(...Object.values(appIcons)),
        provideRiviniaI18n({
          defaultLanguage: 'ar',
          languages: [
            { id: 'ar', nativeName: 'العربية', dir: 'rtl' },
            { id: 'en', nativeName: 'English', dir: 'ltr' },
          ],
          loader: customLoader(async () => ({
            'common.loading': 'جارٍ التحميل',
            'prefs.label': 'التفضيلات',
            'prefs.appearance': 'المظهر',
            'prefs.language': 'اللغة',
            'prefs.themeLight': 'فاتح',
            'prefs.themeDark': 'داكن',
            'nav.docs': 'الدليل',
            'nav.components': 'المكوّنات',
            'nav.playground': 'المختبر',
            'nav.guides': 'الأدلة',
            'nav.github': 'GitHub',
            'nav.opensInNewTab': 'يفتح في تبويب جديد',
            'nav.getStarted': 'ابدأ الآن',
            'nav.primary': 'التنقل الرئيسي',
            'nav.mobile': 'قائمة التنقل',
            'nav.openMenu': 'افتح القائمة',
            'nav.closeMenu': 'أغلق القائمة',
            'nav.skipToContent': 'تخطَّ إلى المحتوى',
          })),
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the preferences menu and GitHub link', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-preferences-menu')).toBeTruthy();
    expect(compiled.querySelector('app-github-link a')).toBeTruthy();
  });
});
