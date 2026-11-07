export const PACKAGE_MANIFEST = [
  {
    id: 'env',
    name: '@rivinia/env',
    translationKey: 'component.env.summary',
    docs: { group: 'foundations' },
    componentsPage: true,
    showcase: false,
  },
  {
    id: 'http',
    name: '@rivinia/http',
    translationKey: 'component.http.summary',
    docs: { group: 'foundations' },
    componentsPage: true,
    showcase: false,
  },
  {
    id: 'i18n',
    name: '@rivinia/i18n',
    translationKey: 'component.i18n.summary',
    docs: { group: 'foundations' },
    componentsPage: true,
    showcase: false,
  },
  {
    id: 'select',
    name: '@rivinia/select',
    translationKey: 'component.select.summary',
    docs: { group: 'components' },
    componentsPage: true,
    showcase: true,
  },
  {
    id: 'theme',
    name: '@rivinia/theme',
    translationKey: 'component.theme.summary',
    docs: { group: 'foundations' },
    componentsPage: true,
    showcase: false,
  },
  {
    id: 'datepicker',
    name: '@rivinia/datepicker',
    translationKey: 'showcase.datepicker.name',
    docs: { group: 'components' },
    componentsPage: false,
    showcase: true,
  },
  {
    id: 'table',
    name: '@rivinia/table',
    translationKey: 'showcase.table.name',
    docs: { group: 'components' },
    componentsPage: false,
    showcase: true,
  },
  {
    id: 'modal',
    name: '@rivinia/modal',
    translationKey: 'showcase.modal.name',
    docs: { group: 'components' },
    componentsPage: false,
    showcase: true,
  },
  {
    id: 'toast',
    name: '@rivinia/toast',
    translationKey: 'showcase.toast.name',
    docs: { group: 'components' },
    componentsPage: false,
    showcase: true,
  },
  {
    id: 'menu',
    name: '@rivinia/menu',
    translationKey: 'showcase.menu.name',
    docs: { group: 'components' },
    componentsPage: true,
    showcase: false,
  },
  {
    id: 'popup',
    name: '@rivinia/popup',
    translationKey: 'showcase.popup.name',
    docs: { group: 'primitives' },
    componentsPage: false,
    showcase: false,
  },
] as const;

export type PackageManifestEntry = (typeof PACKAGE_MANIFEST)[number];
export type ComponentPagePackage = Extract<PackageManifestEntry, { readonly componentsPage: true }>;
export type ShowcasePackage = Extract<PackageManifestEntry, { readonly showcase: true }>;

export const COMPONENT_PAGE_PACKAGES: readonly ComponentPagePackage[] = PACKAGE_MANIFEST.filter(
  (entry): entry is ComponentPagePackage =>
    'componentsPage' in entry && entry.componentsPage === true,
);

export const SHOWCASE_PACKAGES: readonly ShowcasePackage[] = PACKAGE_MANIFEST.filter(
  (entry): entry is ShowcasePackage => 'showcase' in entry && entry.showcase === true,
);
