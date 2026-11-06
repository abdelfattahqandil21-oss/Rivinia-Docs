import { formatIcu } from '@rivinia/i18n';
import { describe, expect, it } from 'vitest';

const english = '{count, plural, =0 {No packages} one {# package} other {# packages}}';
const arabic =
  '{count, plural, =0 {لا توجد حزم} zero {لا توجد حزم} one {حزمة واحدة} two {حزمتان} few {# حزم} many {# حزمة} other {# حزمة}}';

describe('showcase ICU messages', () => {
  it.each([0, 1, 2, 3, 5, 11, 100])('formats English and Arabic plural count %i', (count) => {
    const en = formatIcu(english, { count }, 'en');
    const ar = formatIcu(arabic, { count }, 'ar');
    const category = new Intl.PluralRules('ar').select(count);
    expect(en).toContain(count === 0 ? 'No packages' : count === 1 ? 'package' : 'packages');
    expect(ar).toContain(
      (
        {
          zero: 'لا توجد حزم',
          one: 'حزمة واحدة',
          two: 'حزمتان',
          few: 'حزم',
          many: 'حزمة',
          other: 'حزمة',
        } as const
      )[category],
    );
  });
});
