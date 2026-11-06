export const PACKAGE_MANIFEST = [
  {
    id: 'env',
    name: '@rivinia/env',
    translationKey: 'component.env.summary',
    componentsPage: true,
  },
  {
    id: 'http',
    name: '@rivinia/http',
    translationKey: 'component.http.summary',
    componentsPage: true,
  },
  {
    id: 'i18n',
    name: '@rivinia/i18n',
    translationKey: 'component.i18n.summary',
    componentsPage: true,
  },
  {
    id: 'select',
    name: '@rivinia/select',
    translationKey: 'component.select.summary',
    componentsPage: true,
    showcase: true,
  },
  {
    id: 'theme',
    name: '@rivinia/theme',
    translationKey: 'component.theme.summary',
    componentsPage: true,
  },
  {
    id: 'datepicker',
    name: '@rivinia/datepicker',
    translationKey: 'showcase.datepicker.name',
    showcase: true,
  },
  {
    id: 'table',
    name: '@rivinia/table',
    translationKey: 'showcase.table.name',
    showcase: true,
  },
  {
    id: 'modal',
    name: '@rivinia/modal',
    translationKey: 'showcase.modal.name',
    showcase: true,
  },
  {
    id: 'toast',
    name: '@rivinia/toast',
    translationKey: 'showcase.toast.name',
    showcase: true,
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
