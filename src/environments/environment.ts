import type { AppEnvironment } from './environment.model';

/** Development defaults. Used as-is by the `dev` configuration. */
export const environment: AppEnvironment = {
  production: false,
  version: '0.0.0',
  apiUrl: 'http://localhost:3000/api',
};
