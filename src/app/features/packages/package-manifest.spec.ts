import { PACKAGE_MANIFEST, SHOWCASE_PACKAGES } from './package-manifest';
import { PACKAGE_METADATA } from './package-metadata';

describe('package manifest', () => {
  it('keeps the showcase at six package tabs or fewer', () => {
    expect(SHOWCASE_PACKAGES.length).toBeLessThanOrEqual(6);
  });

  it('keeps every current Rivinia package in one manifest for the footer', () => {
    expect(PACKAGE_MANIFEST).toHaveLength(11);
    expect(new Set(PACKAGE_MANIFEST.map((entry) => entry.id)).size).toBe(11);
    expect(PACKAGE_MANIFEST.map((entry) => entry.name)).toContain('@rivinia/menu');
    expect(PACKAGE_MANIFEST.map((entry) => entry.name)).toContain('@rivinia/popup');
  });

  it('keeps ids and translation keys unique with supported docs groups', () => {
    const ids = PACKAGE_MANIFEST.map((entry) => entry.id);
    const translationKeys = PACKAGE_MANIFEST.map((entry) => entry.translationKey);
    const groups = new Set(['foundations', 'components', 'primitives']);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(translationKeys).size).toBe(translationKeys.length);
    expect(PACKAGE_MANIFEST.every((entry) => groups.has(entry.docs.group))).toBe(true);
  });

  it('has generated package metadata for every manifest entry', () => {
    for (const entry of PACKAGE_MANIFEST) {
      expect(PACKAGE_METADATA[entry.id]).toBeDefined();
      expect(PACKAGE_METADATA[entry.id].name).toBe(entry.name);
      expect(PACKAGE_METADATA[entry.id].version).toMatch(/^\d+\.\d+\.\d+/);
    }
  });
});
