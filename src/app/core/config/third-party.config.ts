import { ApplicationConfig } from '@angular/core';
import { provideLucideIcons } from '@lucide/angular';
import { provideRiviniaHttp } from '@rivinia/http';
import { provideRiviniaI18n } from '@rivinia/i18n';
import { appIcons } from '../../shared/components/icon/icon-registry';

const AR = { id: 'ar', nativeName: 'العربية', dir: 'rtl' } as const;
const EN = { id: 'en', nativeName: 'English', dir: 'ltr' } as const;
export const thirdPartyConfig: ApplicationConfig = {
  providers: [
    provideLucideIcons(...Object.values(appIcons)),
    provideRiviniaI18n({
      defaultLanguage: EN.id,
      languages: [EN, AR],
      // The preferences menu owns the reveal now, for both theme and language.
      viewTransition: {
        enabled: false,
      },
    }),
    provideRiviniaHttp(),
  ],
};
