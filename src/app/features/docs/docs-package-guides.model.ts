export interface DocsPackageGuide {
  readonly summaryKey: string;
  readonly conceptKeys: readonly string[];
  readonly api: readonly { readonly name: string; readonly descriptionKey: string }[];
  readonly references: readonly { readonly titleKey: string; readonly href: string }[];
}

export const DOCS_PACKAGE_GUIDES: Readonly<Record<string, DocsPackageGuide>> = {
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
    references: [
      {
        titleKey: 'docs.guide.env.reference.scaffolding',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/env/v1.0.3/docs/env/scaffolding.md',
      },
    ],
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
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/http/v1.0.3/docs/http/urls-and-services.md',
      },
      {
        titleKey: 'docs.guide.http.reference.resources',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/http/v1.0.3/docs/http/resources.md',
      },
      {
        titleKey: 'docs.guide.http.reference.envelopes',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/http/v1.0.3/docs/http/envelopes-and-errors.md',
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
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.3/docs/i18n/translating.md',
      },
      {
        titleKey: 'docs.guide.i18n.reference.switching',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.3/docs/i18n/switching.md',
      },
      {
        titleKey: 'docs.guide.i18n.reference.icu',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.3/docs/i18n/icu.md',
      },
      {
        titleKey: 'docs.guide.i18n.reference.api',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/i18n/v1.0.3/docs/i18n/api.md',
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
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/theme/v1.0.3/docs/theme/tokens.md',
      },
      {
        titleKey: 'docs.guide.theme.reference.stacks',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/theme/v1.0.3/docs/theme/styling-stacks.md',
      },
      {
        titleKey: 'docs.guide.theme.reference.components',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/theme/v1.0.3/docs/theme/component-theme.md',
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
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/menu/v1.0.3/docs/menu/ready-made.md',
      },
      {
        titleKey: 'docs.guide.menu.reference.headless',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/menu/v1.0.3/docs/menu/headless.md',
      },
      {
        titleKey: 'docs.guide.menu.reference.interaction',
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/menu/v1.0.3/docs/menu/interaction.md',
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
        href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/popup/v1.0.3/projects/popup/specifications/popup-core.md',
      },
    ],
  },
};
