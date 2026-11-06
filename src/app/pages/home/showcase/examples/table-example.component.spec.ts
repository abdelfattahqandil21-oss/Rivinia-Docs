import { ComponentFixture, TestBed } from '@angular/core/testing';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { beforeEach, describe, expect, it } from 'vitest';

import { TableExampleComponent } from './table-example.component';

const translations = {
  'showcase.table.label': 'Rivinia packages',
  'showcase.table.package': 'Package',
  'showcase.table.category': 'Category',
  'showcase.table.status': 'Status',
  'showcase.table.input': 'Input',
  'showcase.table.data': 'Data',
  'showcase.table.overlay': 'Overlay',
  'showcase.table.localization': 'Localization',
  'showcase.table.appearance': 'Appearance',
  'showcase.table.ready': 'Ready',
  'showcase.table.pagination': 'Package pages',
  'showcase.table.previous': 'Previous',
  'showcase.table.next': 'Next',
  'showcase.table.rowsPerPage': 'Rows per page',
  'showcase.table.pageInfo':
    '{count, plural, =0 {No packages} one {# package} other {# packages}} · Page {page} of {pageCount}',
  'showcase.table.hint': 'Select a column heading to sort.',
};

describe('TableExampleComponent', () => {
  let fixture: ComponentFixture<TableExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableExampleComponent],
      providers: [
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TableExampleComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('changes the displayed rows on next and previous and respects page bounds', () => {
    const rows = (): string => fixture.nativeElement.querySelector('rv-table').textContent;
    const next = (): HTMLButtonElement =>
      [...fixture.nativeElement.querySelectorAll('button')].find(
        (button) => button.textContent.trim() === 'Next',
      )!;
    const previous = (): HTMLButtonElement =>
      [...fixture.nativeElement.querySelectorAll('button')].find(
        (button) => button.textContent.trim() === 'Previous',
      )!;

    const firstPage = rows();
    next().click();
    fixture.detectChanges();
    expect(rows()).not.toBe(firstPage);
    expect(fixture.nativeElement.textContent).toContain('Page 2 of 6');
    previous().click();
    fixture.detectChanges();
    expect(rows()).toBe(firstPage);
    expect(previous().disabled).toBe(true);
  });
});
