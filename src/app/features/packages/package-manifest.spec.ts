import { SHOWCASE_PACKAGES } from './package-manifest';

describe('showcase package manifest', () => {
  it('keeps the showcase at six package tabs or fewer', () => {
    expect(SHOWCASE_PACKAGES.length).toBeLessThanOrEqual(6);
  });
});
