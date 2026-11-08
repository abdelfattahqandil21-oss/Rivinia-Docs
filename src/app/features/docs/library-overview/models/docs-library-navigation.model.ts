import { THEME_DOC_PAGES } from './docs-reference-pages.model';

export const THEME_DOC_NAV = THEME_DOC_PAGES.map(({ section, titleKey }) => ({
  section,
  titleKey,
}));

export const I18N_DOC_NAV = [
  {
    section: '',
    titleKey: 'docs.i18n.overview.title',
  },
  {
    section: 'quick-start',
    titleKey: 'docs.i18n.quick-start.title',
  },
  {
    section: 'guides',
    titleKey: 'docs.i18n.guides.title',
  },
  {
    section: 'guides/translating',
    titleKey: 'docs.i18n.guides/translating.title',
  },
  {
    section: 'guides/configuration',
    titleKey: 'docs.i18n.guides/configuration.title',
  },
  {
    section: 'guides/switching',
    titleKey: 'docs.i18n.guides/switching.title',
  },
  {
    section: 'guides/icu',
    titleKey: 'docs.i18n.guides/icu.title',
  },
  {
    section: 'guides/resilience',
    titleKey: 'docs.i18n.guides/resilience.title',
  },
  {
    section: 'guides/controls',
    titleKey: 'docs.i18n.guides/controls.title',
  },
  {
    section: 'guides/cli',
    titleKey: 'docs.i18n.guides/cli.title',
  },
  {
    section: 'api',
    titleKey: 'docs.i18n.api.title',
  },
  {
    section: 'changelog',
    titleKey: 'docs.i18n.changelog.title',
  },
];
