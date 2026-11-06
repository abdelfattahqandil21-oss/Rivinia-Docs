import type { BaseEnvironment } from '@rivinia/env';

/**
 * Application environment contract. Extend with your own fields
 * (apiUrl, keys, feature flags, …) — nothing else in the app should
 * import environment values except through this type.
 */
export interface AppEnvironment extends BaseEnvironment {
  readonly apiUrl: string;
}
