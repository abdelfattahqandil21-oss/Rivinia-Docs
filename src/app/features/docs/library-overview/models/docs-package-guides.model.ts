export interface DocsPackageGuide {
  readonly summaryKey: string;
  readonly conceptKeys: readonly string[];
  readonly api: readonly { readonly name: string; readonly descriptionKey: string }[];
  readonly references: readonly { readonly titleKey: string; readonly href: string }[];
}

export const DOCS_PACKAGE_GUIDES: Readonly<Record<string, DocsPackageGuide>> = {
  select: {
    summaryKey: 'docs.guide.select.summary',
    conceptKeys: [
      'docs.guide.select.modes',
      'docs.guide.select.filtering',
      'docs.guide.select.forms',
    ],
    api: [
      { name: 'RiviniaSelect', descriptionKey: 'docs.guide.select.api.controller' },
      { name: 'RiviniaSelectComponent', descriptionKey: 'docs.guide.select.api.component' },
      { name: 'SelectChange', descriptionKey: 'docs.guide.select.api.change' },
    ],
    references: [
      {
        titleKey: 'docs.guide.select.reference.headless',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/select/v1.0.4/docs/select/headless.md',
      },
      {
        titleKey: 'docs.guide.select.reference.forms',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/select/v1.0.4/docs/select/forms.md',
      },
      {
        titleKey: 'docs.guide.select.reference.accessibility',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/select/v1.0.4/docs/select/accessibility.md',
      },
    ],
  },
  datepicker: {
    summaryKey: 'docs.guide.datepicker.summary',
    conceptKeys: [
      'docs.guide.datepicker.civilValues',
      'docs.guide.datepicker.timeZones',
      'docs.guide.datepicker.locale',
    ],
    api: [
      { name: 'RiviniaDate · RiviniaDateTime', descriptionKey: 'docs.guide.datepicker.api.values' },
      { name: 'RiviniaCalendar', descriptionKey: 'docs.guide.datepicker.api.controller' },
      {
        name: 'RiviniaDatepickerComponent · RiviniaDatetimepickerComponent',
        descriptionKey: 'docs.guide.datepicker.api.components',
      },
    ],
    references: [
      {
        titleKey: 'docs.guide.datepicker.reference.overview',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/datepicker/v1.0.4/docs/datepicker/overview.md',
      },
      {
        titleKey: 'docs.guide.datepicker.reference.timeZones',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/datepicker/v1.0.4/docs/datepicker/time-zones-and-dst.md',
      },
      {
        titleKey: 'docs.guide.datepicker.reference.keyboard',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/datepicker/v1.0.4/docs/datepicker/keyboard-and-rtl.md',
      },
    ],
  },
  table: {
    summaryKey: 'docs.guide.table.summary',
    conceptKeys: [
      'docs.guide.table.typedColumns',
      'docs.guide.table.pipeline',
      'docs.guide.table.customization',
    ],
    api: [
      { name: 'createTable()', descriptionKey: 'docs.guide.table.api.create' },
      { name: 'tableColumn<T>()', descriptionKey: 'docs.guide.table.api.column' },
      { name: 'paginate()', descriptionKey: 'docs.guide.table.api.paginate' },
    ],
    references: [
      {
        titleKey: 'docs.guide.table.reference.columns',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/table/v1.0.4/docs/table/columns.md',
      },
      {
        titleKey: 'docs.guide.table.reference.paging',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/table/v1.0.4/docs/table/paging-and-state.md',
      },
      {
        titleKey: 'docs.guide.table.reference.selection',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/table/v1.0.4/docs/table/selection.md',
      },
    ],
  },
  modal: {
    summaryKey: 'docs.guide.modal.summary',
    conceptKeys: [
      'docs.guide.modal.typedResults',
      'docs.guide.modal.guards',
      'docs.guide.modal.admission',
    ],
    api: [
      { name: 'provideRiviniaModal()', descriptionKey: 'docs.guide.modal.api.provider' },
      {
        name: 'RiviniaModal.openModal<TData, TResult>()',
        descriptionKey: 'docs.guide.modal.api.open',
      },
      { name: 'ModalHandle · ModalResult', descriptionKey: 'docs.guide.modal.api.result' },
    ],
    references: [
      {
        titleKey: 'docs.guide.modal.reference.typed',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/modal/v1.0.4/docs/modal/typed-modals.md',
      },
      {
        titleKey: 'docs.guide.modal.reference.guards',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/modal/v1.0.4/docs/modal/lifecycle-and-guards.md',
      },
      {
        titleKey: 'docs.guide.modal.reference.stacking',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/modal/v1.0.4/docs/modal/sizing-and-stacking.md',
      },
    ],
  },
  toast: {
    summaryKey: 'docs.guide.toast.summary',
    conceptKeys: ['docs.guide.toast.queue', 'docs.guide.toast.actions', 'docs.guide.toast.layers'],
    api: [
      { name: 'injectRiviniaToast()', descriptionKey: 'docs.guide.toast.api.inject' },
      { name: 'RiviniaToast.show()', descriptionKey: 'docs.guide.toast.api.show' },
      { name: 'RiviniaToastList', descriptionKey: 'docs.guide.toast.api.list' },
    ],
    references: [
      {
        titleKey: 'docs.guide.toast.reference.readyMade',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/toast/v1.0.4/docs/toast/ready-made-ui.md',
      },
      {
        titleKey: 'docs.guide.toast.reference.headless',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/toast/v1.0.4/docs/toast/headless.md',
      },
      {
        titleKey: 'docs.guide.toast.reference.managedList',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/toast/v1.0.4/docs/toast/top-layer-and-managed-list.md',
      },
    ],
  },
  env: {
    summaryKey: 'docs.guide.env.summary',
    conceptKeys: [
      'docs.guide.env.contract',
      'docs.guide.env.buildTime',
      'docs.guide.env.schematic',
    ],
    api: [
      { name: 'BaseEnvironment', descriptionKey: 'docs.guide.env.api.baseEnvironment' },
      { name: 'ng add @rivinia/env', descriptionKey: 'docs.guide.env.api.schematic' },
    ],
    references: [],
  },
  http: {
    summaryKey: 'docs.guide.http.summary',
    conceptKeys: [
      'docs.guide.http.client',
      'docs.guide.http.resource',
      'docs.guide.http.envelopes',
    ],
    api: [
      { name: 'injectRiviniaHttp()', descriptionKey: 'docs.guide.http.api.inject' },
      { name: 'joinUrl()', descriptionKey: 'docs.guide.http.api.joinUrl' },
      { name: 'RiviniaHttp.getResource()', descriptionKey: 'docs.guide.http.api.resource' },
    ],
    references: [
      {
        titleKey: 'docs.guide.http.reference.urls',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/http/v1.0.4/docs/http/urls-and-services.md',
      },
      {
        titleKey: 'docs.guide.http.reference.resources',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/http/v1.0.4/docs/http/resources.md',
      },
      {
        titleKey: 'docs.guide.http.reference.envelopes',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/http/v1.0.4/docs/http/envelopes-and-errors.md',
      },
    ],
  },
  i18n: {
    summaryKey: 'docs.guide.i18n.summary',
    conceptKeys: [
      'docs.guide.i18n.languageState',
      'docs.guide.i18n.translations',
      'docs.guide.i18n.icu',
    ],
    api: [
      { name: 'RiviniaI18n', descriptionKey: 'docs.guide.i18n.api.manager' },
      { name: 'RvTranslatePipe', descriptionKey: 'docs.guide.i18n.api.pipe' },
      { name: 'defineRiviniaI18n()', descriptionKey: 'docs.guide.i18n.api.define' },
    ],
    references: [
      {
        titleKey: 'docs.guide.i18n.reference.translations',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.4/docs/i18n/translating.md',
      },
      {
        titleKey: 'docs.guide.i18n.reference.switching',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.4/docs/i18n/switching.md',
      },
      {
        titleKey: 'docs.guide.i18n.reference.icu',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.4/docs/i18n/icu.md',
      },
      {
        titleKey: 'docs.guide.i18n.reference.api',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.4/docs/i18n/api.md',
      },
    ],
  },
  theme: {
    summaryKey: 'docs.guide.theme.summary',
    conceptKeys: [
      'docs.guide.theme.tokens',
      'docs.guide.theme.schemes',
      'docs.guide.theme.adapters',
    ],
    api: [
      { name: '@rivinia/theme', descriptionKey: 'docs.guide.theme.api.base' },
      { name: '@rivinia/theme/theme.css', descriptionKey: 'docs.guide.theme.api.css' },
      { name: '@rivinia/theme/tailwind.css', descriptionKey: 'docs.guide.theme.api.adapters' },
    ],
    references: [
      {
        titleKey: 'docs.guide.theme.reference.tokens',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/theme/v1.0.4/docs/theme/tokens.md',
      },
      {
        titleKey: 'docs.guide.theme.reference.stacks',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/theme/v1.0.4/docs/theme/styling-stacks.md',
      },
      {
        titleKey: 'docs.guide.theme.reference.components',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/theme/v1.0.4/docs/theme/component-theme.md',
      },
    ],
  },
  menu: {
    summaryKey: 'docs.guide.menu.summary',
    conceptKeys: ['docs.guide.menu.actions', 'docs.guide.menu.keyboard', 'docs.guide.menu.layers'],
    api: [
      { name: 'RiviniaMenu', descriptionKey: 'docs.guide.menu.api.controller' },
      { name: 'RiviniaMenuComponent', descriptionKey: 'docs.guide.menu.api.component' },
      { name: 'rvMenuTrigger · (picked)', descriptionKey: 'docs.guide.menu.api.trigger' },
    ],
    references: [
      {
        titleKey: 'docs.guide.menu.reference.readyMade',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/menu/v1.0.4/docs/menu/ready-made.md',
      },
      {
        titleKey: 'docs.guide.menu.reference.headless',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/menu/v1.0.4/docs/menu/headless.md',
      },
      {
        titleKey: 'docs.guide.menu.reference.interaction',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/menu/v1.0.4/docs/menu/interaction.md',
      },
    ],
  },
  popup: {
    summaryKey: 'docs.guide.popup.summary',
    conceptKeys: [
      'docs.guide.popup.position',
      'docs.guide.popup.dismissal',
      'docs.guide.popup.boundary',
    ],
    api: [
      { name: 'computePopupPosition()', descriptionKey: 'docs.guide.popup.api.position' },
      { name: 'bindPopupDismissal()', descriptionKey: 'docs.guide.popup.api.dismissal' },
      { name: 'POPUP_GAP · POPUP_EDGE_INSET', descriptionKey: 'docs.guide.popup.api.constants' },
    ],
    references: [
      {
        titleKey: 'docs.guide.popup.reference.core',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/popup/v1.0.4/projects/popup/specifications/popup-core.md',
      },
    ],
  },
};
