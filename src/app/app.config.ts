import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideRiviniaI18n } from '@rivinia/i18n';
import { provideRiviniaHttp } from '@rivinia/http';
const AR = { id: 'ar', nativeName: 'العربية', dir: 'rtl' } as const;
const EN = { id: 'en', nativeName: 'English', dir: 'ltr' } as const;
export const appConfig: ApplicationConfig = {
  providers: [
    provideRiviniaHttp(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideRiviniaI18n({
      defaultLanguage: AR.id,
      languages: [AR, EN],
      viewTransition: {
        enabled: true,
        skipInitialTransition: true,
      },
    }),
  ],
};
