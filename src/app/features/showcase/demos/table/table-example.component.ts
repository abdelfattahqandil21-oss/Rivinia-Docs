import { Component, computed, inject, signal } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { createTable, type TableColumn } from '@rivinia/table';
import { RiviniaTableComponent } from '@rivinia/table/ui';

interface ShowcasePackage {
  readonly name: string;
  readonly category: string;
  readonly status: string;
}

const PACKAGES: readonly ShowcasePackage[] = Array.from({ length: 28 }, (_, index) => {
  const entries = [
    ['@rivinia/select', 'showcase.table.input'],
    ['@rivinia/datepicker', 'showcase.table.input'],
    ['@rivinia/table', 'showcase.table.data'],
    ['@rivinia/modal', 'showcase.table.overlay'],
    ['@rivinia/i18n', 'showcase.table.localization'],
    ['@rivinia/theme', 'showcase.table.appearance'],
    ['@rivinia/popup', 'showcase.table.overlay'],
  ] as const;
  const [name, category] = entries[index % entries.length];
  return { name, category, status: 'showcase.table.ready' };
});

@Component({
  imports: [RiviniaTableComponent, RvTranslatePipe],
  selector: 'app-showcase-table-example',
  templateUrl: './table-example.component.html',
  styleUrl: './table-example.component.css',
})
export class TableExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly columns = computed<readonly TableColumn<ShowcasePackage>[]>(() => {
    this.i18n.currentLanguage();
    return [
      {
        id: 'name',
        header: this.i18n.translate('showcase.table.package'),
        accessor: 'name',
        width: '6rem',
        flex: 1,
        textOverflow: 'wrap',
        lines: 2,
        sortable: true,
      },
      {
        id: 'category',
        header: this.i18n.translate('showcase.table.category'),
        accessor: (row) => this.i18n.translate(row.category),
        width: '6rem',
        flex: 1,
        textOverflow: 'wrap',
        lines: 2,
        sortable: true,
      },
      {
        id: 'status',
        header: this.i18n.translate('showcase.table.status'),
        accessor: (row) => this.i18n.translate(row.status),
        width: '6rem',
        flex: 1,
        textOverflow: 'wrap',
        lines: 2,
      },
    ];
  });
  protected readonly pageSize = signal(5);
  protected readonly table = createTable<ShowcasePackage>(() => ({
    columns: () => this.columns(),
    data: () => PACKAGES,
    locale: () => this.i18n.currentLanguage(),
    pageSize: this.pageSize(),
  }));
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(PACKAGES.length / this.pageSize())),
  );
  protected previousPage(): void {
    this.table.page.update((page) => Math.max(0, page - 1));
  }
  protected nextPage(): void {
    this.table.page.update((page) => Math.min(this.pageCount() - 1, page + 1));
  }
  protected changePageSize(value: string): void {
    this.pageSize.set(Number(value));
    this.table.page.set(0);
  }
}
