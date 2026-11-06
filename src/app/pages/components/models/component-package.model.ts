/** One Rivinia package shown on the components page. */
export interface ComponentPackage {
  /** npm package name, shown verbatim. */
  readonly name: string;
  /** Translation key for the one-line summary. */
  readonly summaryKey: string;
}

export const COMPONENT_PACKAGES = [
  { name: '@rivinia/env', summaryKey: 'component.env.summary' },
  { name: '@rivinia/http', summaryKey: 'component.http.summary' },
  { name: '@rivinia/i18n', summaryKey: 'component.i18n.summary' },
  { name: '@rivinia/select', summaryKey: 'component.select.summary' },
  { name: '@rivinia/theme', summaryKey: 'component.theme.summary' },
] as const satisfies readonly ComponentPackage[];
