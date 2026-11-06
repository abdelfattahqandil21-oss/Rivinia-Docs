import type { ExternalNavLink, NavLink } from '../models/nav-link.model';

/**
 * Primary site navigation.
 *
 * One source of truth for the navbar, the mobile panel and the routes' titles.
 * `labelKey` points at a key in `public/i18n/*.json`; the navbar translates it,
 * so adding a page means adding an entry here and a route, nothing else.
 *
 * The landing page (`/`) is reached through the brand mark, so it is not an
 * entry here; the four product areas are.
 */

export const NAV_LINKS = [
  { id: 'docs', path: '/docs', labelKey: 'nav.docs' },
  { id: 'components', path: '/components', labelKey: 'nav.components' },
  { id: 'playground', path: '/playground', labelKey: 'nav.playground' },
  { id: 'guides', path: '/guides', labelKey: 'nav.guides' },
] as const satisfies readonly NavLink[];

/** The project's public home on GitHub, opened in a new tab. */
export const GITHUB_LINK = {
  id: 'github',
  href: 'https://github.com/abdelfattahqandil21-oss/Rivinia/blob/main/README.md',
  labelKey: 'nav.github',
} as const satisfies ExternalNavLink;
