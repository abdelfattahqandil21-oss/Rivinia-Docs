export const DOCS_PACKAGE_GROUPS = ['foundations', 'components', 'primitives'] as const;

export type DocsPackageGroup = (typeof DOCS_PACKAGE_GROUPS)[number];

export type DocsNavGroup = DocsPackageGroup | 'getting-started';
