import { PACKAGE_MANIFEST, SHOWCASE_PACKAGES } from './package-manifest';

describe('showcase package manifest', () => {
  it('keeps the showcase at six package tabs or fewer', () => {
    expect(SHOWCASE_PACKAGES.length).toBeLessThanOrEqual(6);
  });

  it('keeps every current Rivinia package in one manifest for the footer', () => {
    expect(PACKAGE_MANIFEST).toHaveLength(11);
    expect(new Set(PACKAGE_MANIFEST.map((entry) => entry.id)).size).toBe(11);
    expect(PACKAGE_MANIFEST.map((entry) => entry.name)).toContain('@rivinia/menu');
    expect(PACKAGE_MANIFEST.map((entry) => entry.name)).toContain('@rivinia/popup');
  });
});
