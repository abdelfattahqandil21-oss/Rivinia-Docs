/** One entry of the primary site navigation. */
export interface NavLink {
  /** Stable id, also accepted by the navbar's `active` override. */
  readonly id: string;
  /** Router path. */
  readonly path: string;
  /** Translation key from `public/i18n/{language}.json`. */
  readonly labelKey: string;
  /** Match the path exactly instead of as a prefix. */
  readonly exact?: boolean;
}

/** A destination outside the app, rendered as a link that opens a new tab. */
export interface ExternalNavLink {
  /** Stable id. */
  readonly id: string;
  /** Absolute URL. */
  readonly href: string;
  /** Translation key from `public/i18n/{language}.json`. */
  readonly labelKey: string;
}
