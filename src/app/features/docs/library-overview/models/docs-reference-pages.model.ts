export interface DocsReferenceSection {
  readonly id: string;
  readonly titleKey: string;
  readonly bodyKey: string;
  readonly code?: string;
  readonly language?: 'ts' | 'html' | 'json' | 'bash' | 'text';
  readonly filename?: string;
  readonly rows?: readonly { readonly name: string; readonly descriptionKey: string }[];
}
export interface DocsReferencePage {
  readonly section: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly sections: readonly DocsReferenceSection[];
}
export const I18N_DOC_PAGES: readonly DocsReferencePage[] = [
  {
    section: '',
    titleKey: 'docs.i18n.overview.title',
    descriptionKey: 'docs.i18n.overview.description',
    sections: [
      {
        id: 'entry-points',
        titleKey: 'docs.i18n.entry-points.title',
        bodyKey: 'docs.i18n.entry-points.body',
        rows: [
          {
            name: '@rivinia/i18n',
            descriptionKey: 'docs.i18n.entry-points.row.0',
          },
          {
            name: '@rivinia/i18n/ui',
            descriptionKey: 'docs.i18n.entry-points.row.1',
          },
          {
            name: '@rivinia/i18n/select',
            descriptionKey: 'docs.i18n.entry-points.row.2',
          },
        ],
      },
      {
        id: 'language-flow',
        titleKey: 'docs.i18n.language-flow.title',
        bodyKey: 'docs.i18n.language-flow.body',
      },
    ],
  },
  {
    section: 'quick-start',
    titleKey: 'docs.i18n.quick-start.title',
    descriptionKey: 'docs.i18n.quick-start.description',
    sections: [
      {
        id: 'installation',
        titleKey: 'docs.i18n.installation.title',
        bodyKey: 'docs.i18n.installation.body',
        code: 'npm install @rivinia/i18n',
        language: 'bash',
        filename: 'terminal',
      },
      {
        id: 'scaffolding',
        titleKey: 'docs.i18n.scaffolding.title',
        bodyKey: 'docs.i18n.scaffolding.body',
        code: 'npx rivinia-i18n-keys init --languages ar:العربية:rtl,en:English:ltr --default en',
        language: 'bash',
        filename: 'terminal',
      },
      {
        id: 'register-provider',
        titleKey: 'docs.i18n.register-provider.title',
        bodyKey: 'docs.i18n.register-provider.body',
        code: "import type { ApplicationConfig } from '@angular/core';\nimport { i18n } from './i18n/languages';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [i18n.provide()],\n};",
        language: 'ts',
        filename: 'src/app/app.config.ts',
      },
      {
        id: 'first-dictionary',
        titleKey: 'docs.i18n.first-dictionary.title',
        bodyKey: 'docs.i18n.first-dictionary.body',
        code: '{\n  "app": {\n    "title": "My application",\n    "welcome": "Welcome, {name}"\n  }\n}',
        language: 'json',
        filename: 'public/i18n/en.json',
      },
      {
        id: 'first-translation',
        titleKey: 'docs.i18n.first-translation.title',
        bodyKey: 'docs.i18n.first-translation.body',
        code: "import { Component } from '@angular/core';\nimport { RvTranslatePipe } from '@rivinia/i18n';\nimport { injectI18n } from './i18n/languages';\n\n@Component({\n  selector: 'app-welcome',\n  imports: [RvTranslatePipe],\n  template: `\n    <h1>{{ title() }}</h1>\n    <p>{{ 'app.welcome' | rvTranslate: { name: 'Sara' } }}</p>\n    <button type=\"button\" (click)=\"i18n.setLanguage('ar')\">العربية</button>\n  `,\n})\nexport class WelcomeComponent {\n  readonly i18n = injectI18n();\n  readonly title = this.i18n.t('app.title');\n}",
        language: 'ts',
        filename: 'src/app/welcome.component.ts',
      },
    ],
  },
  {
    section: 'guides',
    titleKey: 'docs.i18n.guides.title',
    descriptionKey: 'docs.i18n.guides.description',
    sections: [
      {
        id: 'choose-a-guide',
        titleKey: 'docs.i18n.choose-a-guide.title',
        bodyKey: 'docs.i18n.choose-a-guide.body',
      },
    ],
  },
  {
    section: 'guides/translating',
    titleKey: 'docs.i18n.guides/translating.title',
    descriptionKey: 'docs.i18n.guides/translating.description',
    sections: [
      {
        id: 'translation-methods',
        titleKey: 'docs.i18n.translation-methods.title',
        bodyKey: 'docs.i18n.translation-methods.body',
        rows: [
          {
            name: 't(key, params?)',
            descriptionKey: 'docs.i18n.translation-methods.row.0',
          },
          {
            name: 'translate(key, params?)',
            descriptionKey: 'docs.i18n.translation-methods.row.1',
          },
          {
            name: 'rvTranslate',
            descriptionKey: 'docs.i18n.translation-methods.row.2',
          },
        ],
      },
      {
        id: 'reactive-parameters',
        titleKey: 'docs.i18n.reactive-parameters.title',
        bodyKey: 'docs.i18n.reactive-parameters.body',
        code: "readonly count = signal(1);\nreadonly items = this.i18n.t('cart.items', () => ({ count: this.count() }));\n\n// Template: {{ items() }}",
        language: 'ts',
        filename: 'cart.component.ts',
      },
      {
        id: 'default-values',
        titleKey: 'docs.i18n.default-values.title',
        bodyKey: 'docs.i18n.default-values.body',
        code: "this.i18n.translate('app.title', 'Untitled');\nreadonly title = this.i18n.t('app.title', 'Untitled');\nthis.i18n.translate({ en: 'Save', ar: 'حفظ' });",
        language: 'ts',
        filename: 'translation-examples.ts',
      },
      {
        id: 'pipe-usage',
        titleKey: 'docs.i18n.pipe-usage.title',
        bodyKey: 'docs.i18n.pipe-usage.body',
        code: "<p>{{ 'app.welcome' | rvTranslate: { name: userName() } }}</p>\n<p>{{ 'app.title' | rvTranslate: 'Untitled' }}</p>",
        language: 'html',
        filename: 'template.html',
      },
    ],
  },
  {
    section: 'guides/configuration',
    titleKey: 'docs.i18n.guides/configuration.title',
    descriptionKey: 'docs.i18n.guides/configuration.description',
    sections: [
      {
        id: 'language-contract',
        titleKey: 'docs.i18n.language-contract.title',
        bodyKey: 'docs.i18n.language-contract.body',
        code: "import { defineRiviniaI18n } from '@rivinia/i18n';\n\nexport const i18n = defineRiviniaI18n({\n  languages: [\n    { id: 'en', nativeName: 'English', dir: 'ltr', locale: 'en-GB' },\n    { id: 'ar', nativeName: 'العربية', dir: 'rtl', locale: 'ar-EG' },\n  ],\n  defaultLanguage: 'en',\n  fallbackLanguage: 'en',\n});\nexport const injectI18n = i18n.inject;",
        language: 'ts',
        filename: 'src/app/i18n/languages.ts',
      },
      {
        id: 'dictionary-loaders',
        titleKey: 'docs.i18n.dictionary-loaders.title',
        bodyKey: 'docs.i18n.dictionary-loaders.body',
        code: "import { jsonLoader, httpLoader, remoteLoader, customLoader } from '@rivinia/i18n';\n\njsonLoader({ path: 'assets/i18n' });\nhttpLoader({ endpoint: 'https://api.example.com/i18n' });\nremoteLoader({ url: language => `https://cdn.example.com/${language}.json` });\ncustomLoader(async language => ({ 'app.title': language === 'ar' ? 'تطبيقي' : 'My app' }));",
        language: 'ts',
        filename: 'loader-options.ts',
      },
      {
        id: 'inline-dictionaries',
        titleKey: 'docs.i18n.inline-dictionaries.title',
        bodyKey: 'docs.i18n.inline-dictionaries.body',
      },
      {
        id: 'server-rendering',
        titleKey: 'docs.i18n.server-rendering.title',
        bodyKey: 'docs.i18n.server-rendering.body',
      },
    ],
  },
  {
    section: 'guides/switching',
    titleKey: 'docs.i18n.guides/switching.title',
    descriptionKey: 'docs.i18n.guides/switching.description',
    sections: [
      {
        id: 'switch-language',
        titleKey: 'docs.i18n.switch-language.title',
        bodyKey: 'docs.i18n.switch-language.body',
        code: "this.i18n.setLanguage('ar');\nawait this.i18n.setLanguageAsync('en');\nthis.i18n.toggle(); // First two languages\nthis.i18n.next();\nthis.i18n.previous();",
        language: 'ts',
        filename: 'language-actions.ts',
      },
      {
        id: 'language-signals',
        titleKey: 'docs.i18n.language-signals.title',
        bodyKey: 'docs.i18n.language-signals.body',
      },
      {
        id: 'persistence-detection',
        titleKey: 'docs.i18n.persistence-detection.title',
        bodyKey: 'docs.i18n.persistence-detection.body',
      },
      {
        id: 'locale-formatting',
        titleKey: 'docs.i18n.locale-formatting.title',
        bodyKey: 'docs.i18n.locale-formatting.body',
        code: "readonly total = computed(() => this.i18n.formatNumber(1234.5));\nreadonly date = computed(() => this.i18n.formatDate(0, { dateStyle: 'long' }));",
        language: 'ts',
        filename: 'formatting.ts',
      },
    ],
  },
  {
    section: 'guides/icu',
    titleKey: 'docs.i18n.guides/icu.title',
    descriptionKey: 'docs.i18n.guides/icu.description',
    sections: [
      {
        id: 'plural-messages',
        titleKey: 'docs.i18n.plural-messages.title',
        bodyKey: 'docs.i18n.plural-messages.body',
        code: '{\n  "cart.items": "{count, plural, =0 {Your cart is empty} one {# item} other {# items}}"\n}',
        language: 'json',
        filename: 'public/i18n/en.json',
      },
      {
        id: 'select-and-ordinal',
        titleKey: 'docs.i18n.select-and-ordinal.title',
        bodyKey: 'docs.i18n.select-and-ordinal.body',
        code: '{gender, select, female {She replied} male {He replied} other {They replied}}\n{rank, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}',
        language: 'text',
        filename: 'ICU messages',
      },
      {
        id: 'icu-formatting',
        titleKey: 'docs.i18n.icu-formatting.title',
        bodyKey: 'docs.i18n.icu-formatting.body',
        code: "import { formatIcu } from '@rivinia/i18n';\n\nformatIcu('{amount, number, ::currency/USD}', { amount: 25 }, 'en-US');\nformatIcu('{day, date, long}', { day: new Date() }, 'ar-EG');",
        language: 'ts',
        filename: 'icu-formatting.ts',
      },
    ],
  },
  {
    section: 'guides/resilience',
    titleKey: 'docs.i18n.guides/resilience.title',
    descriptionKey: 'docs.i18n.guides/resilience.description',
    sections: [
      {
        id: 'resolution-order',
        titleKey: 'docs.i18n.resolution-order.title',
        bodyKey: 'docs.i18n.resolution-order.body',
      },
      {
        id: 'missing-reporting',
        titleKey: 'docs.i18n.missing-reporting.title',
        bodyKey: 'docs.i18n.missing-reporting.body',
        code: "provideRiviniaI18n({\n  languages: [{ id: 'en', dir: 'ltr' }],\n  onMissingKey: event => console.warn(event.key, event.language),\n  onMissingParam: event => console.warn(event.key, event.param),\n  onLoadError: (language, error) => console.error(language, error),\n});",
        language: 'ts',
        filename: 'reporting.ts',
      },
      {
        id: 'reload-dictionaries',
        titleKey: 'docs.i18n.reload-dictionaries.title',
        bodyKey: 'docs.i18n.reload-dictionaries.body',
        code: "const refreshed = await this.i18n.reload();\nawait this.i18n.reload('en');\nawait this.i18n.loadTranslations('ar'); // Preload without switching",
        language: 'ts',
        filename: 'dictionary-recovery.ts',
      },
    ],
  },
  {
    section: 'guides/controls',
    titleKey: 'docs.i18n.guides/controls.title',
    descriptionKey: 'docs.i18n.guides/controls.description',
    sections: [
      {
        id: 'language-toggle',
        titleKey: 'docs.i18n.language-toggle.title',
        bodyKey: 'docs.i18n.language-toggle.body',
        code: 'import { RiviniaLanguageToggle } from \'@rivinia/i18n/ui\';\n\n// Add RiviniaLanguageToggle to component imports.\n// i18n is the injected manager; switchLabel is i18n.t(\'common.switchLanguage\').\n// Template:\n// <rv-language-toggle [manager]="i18n" [label]="switchLabel()" />',
        language: 'ts',
        filename: 'toggle-setup.ts',
      },
      {
        id: 'language-picker',
        titleKey: 'docs.i18n.language-picker.title',
        bodyKey: 'docs.i18n.language-picker.body',
        code: '<rv-language-select\n  [manager]="i18n"\n  [label]="languageLabel()"\n  [searchable]="true"\n/>',
        language: 'html',
        filename: 'language-picker.component.html',
      },
      {
        id: 'control-contracts',
        titleKey: 'docs.i18n.control-contracts.title',
        bodyKey: 'docs.i18n.control-contracts.body',
      },
    ],
  },
  {
    section: 'guides/cli',
    titleKey: 'docs.i18n.guides/cli.title',
    descriptionKey: 'docs.i18n.guides/cli.description',
    sections: [
      {
        id: 'ng-add',
        titleKey: 'docs.i18n.ng-add.title',
        bodyKey: 'docs.i18n.ng-add.body',
        code: 'ng add @rivinia/i18n\nnpx rivinia-i18n-keys init --dry-run',
        language: 'bash',
        filename: 'terminal',
      },
      {
        id: 'typed-keys',
        titleKey: 'docs.i18n.typed-keys.title',
        bodyKey: 'docs.i18n.typed-keys.body',
        code: 'npx rivinia-i18n-keys --source public/i18n/en.json --out src/i18n-keys.d.ts\nnpx rivinia-i18n-keys --check',
        language: 'bash',
        filename: 'terminal',
      },
      {
        id: 'dictionary-parity',
        titleKey: 'docs.i18n.dictionary-parity.title',
        bodyKey: 'docs.i18n.dictionary-parity.body',
        code: 'npx rivinia-i18n-keys --parity --dir public/i18n --base en',
        language: 'bash',
        filename: 'terminal',
      },
    ],
  },
  {
    section: 'api',
    titleKey: 'docs.i18n.api.title',
    descriptionKey: 'docs.i18n.api.description',
    sections: [
      {
        id: 'providers',
        titleKey: 'docs.i18n.providers.title',
        bodyKey: 'docs.i18n.providers.body',
        rows: [
          {
            name: 'provideRiviniaI18n(config)',
            descriptionKey: 'docs.i18n.providers.row.0',
          },
          {
            name: 'defineRiviniaI18n(config)',
            descriptionKey: 'docs.i18n.providers.row.1',
          },
          {
            name: 'injectRiviniaI18n<L>()',
            descriptionKey: 'docs.i18n.providers.row.2',
          },
          {
            name: 'Language<L>',
            descriptionKey: 'docs.i18n.providers.row.3',
          },
        ],
      },
      {
        id: 'translation-api',
        titleKey: 'docs.i18n.translation-api.title',
        bodyKey: 'docs.i18n.translation-api.body',
        rows: [
          {
            name: 'translate(key, params?)',
            descriptionKey: 'docs.i18n.translation-api.row.0',
          },
          {
            name: 'translate(key, defaultValue, params?)',
            descriptionKey: 'docs.i18n.translation-api.row.1',
          },
          {
            name: 'translate(Translation<L>)',
            descriptionKey: 'docs.i18n.translation-api.row.2',
          },
          {
            name: 't(key, params?)',
            descriptionKey: 'docs.i18n.translation-api.row.3',
          },
          {
            name: 't(key, defaultValue, params?)',
            descriptionKey: 'docs.i18n.translation-api.row.4',
          },
          {
            name: 'RvTranslatePipe',
            descriptionKey: 'docs.i18n.translation-api.row.5',
          },
        ],
      },
      {
        id: 'state-and-actions',
        titleKey: 'docs.i18n.state-and-actions.title',
        bodyKey: 'docs.i18n.state-and-actions.body',
        rows: [
          {
            name: 'currentLanguage / languages / currentLanguageObject',
            descriptionKey: 'docs.i18n.state-and-actions.row.0',
          },
          {
            name: 'dir / isRtl / locale',
            descriptionKey: 'docs.i18n.state-and-actions.row.1',
          },
          {
            name: 'ready / isLoading / loadingState / loadingError',
            descriptionKey: 'docs.i18n.state-and-actions.row.2',
          },
          {
            name: 'setLanguage / setLanguageAsync',
            descriptionKey: 'docs.i18n.state-and-actions.row.3',
          },
          {
            name: 'toggle / next / previous',
            descriptionKey: 'docs.i18n.state-and-actions.row.4',
          },
          {
            name: 'loadTranslations / reload',
            descriptionKey: 'docs.i18n.state-and-actions.row.5',
          },
          {
            name: 'formatNumber / formatDate',
            descriptionKey: 'docs.i18n.state-and-actions.row.6',
          },
          {
            name: 'missingKeys / clearMissingKeys / clearMissingParams',
            descriptionKey: 'docs.i18n.state-and-actions.row.7',
          },
        ],
      },
      {
        id: 'loader-contracts',
        titleKey: 'docs.i18n.loader-contracts.title',
        bodyKey: 'docs.i18n.loader-contracts.body',
        rows: [
          {
            name: 'LoaderDescriptor<L>',
            descriptionKey: 'docs.i18n.loader-contracts.row.0',
          },
          {
            name: 'TranslationLoader<L>',
            descriptionKey: 'docs.i18n.loader-contracts.row.1',
          },
          {
            name: 'LoaderContext',
            descriptionKey: 'docs.i18n.loader-contracts.row.2',
          },
          {
            name: 'TranslateParams',
            descriptionKey: 'docs.i18n.loader-contracts.row.3',
          },
          {
            name: 'MissingKeyEvent / MissingParamEvent',
            descriptionKey: 'docs.i18n.loader-contracts.row.4',
          },
          {
            name: 'RiviniaLoadError',
            descriptionKey: 'docs.i18n.loader-contracts.row.5',
          },
        ],
      },
    ],
  },
  {
    section: 'changelog',
    titleKey: 'docs.i18n.changelog.title',
    descriptionKey: 'docs.i18n.changelog.description',
    sections: [
      {
        id: 'release-1-0-4',
        titleKey: 'docs.i18n.release-1-0-4.title',
        bodyKey: 'docs.i18n.release-1-0-4.body',
      },
    ],
  },
];
