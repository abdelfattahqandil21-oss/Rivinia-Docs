import { Component, computed, inject, signal } from '@angular/core';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideEye,
  LucidePencil,
  LucideTrash2,
} from '@lucide/angular';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { createTable, type TableColumn } from '@rivinia/table';
import { RiviniaTableComponent, RvTableCell } from '@rivinia/table/ui';
import type { SelectChange } from '@rivinia/select/ui';
import { RiviniaSelectComponent } from '@rivinia/select/ui';

interface ShowcasePackage {
  readonly id: number;
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
  return { id: index + 1, name, category, status: 'showcase.table.ready' };
});

@Component({
  imports: [
    RiviniaTableComponent,
    RvTableCell,
    RiviniaSelectComponent,
    RvTranslatePipe,
    LucideArrowLeft,
    LucideArrowRight,
    LucideEye,
    LucidePencil,
    LucideTrash2,
  ],
  selector: 'app-showcase-table-example',
  templateUrl: './table-example.component.html',
  styleUrl: './table-example.component.css',
})
export class TableExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly packages = signal([...PACKAGES]);
  protected readonly actionMessage = signal('');
  protected readonly isRtl = computed(() => this.i18n.locale().startsWith('ar'));
  protected readonly pageSizeOptions = [
    { id: '5', label: '5' },
    { id: '10', label: '10' },
  ];
  protected readonly pageSizeValue = signal<SelectChange>('5');
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
      {
        id: 'actions',
        header: this.i18n.translate('showcase.table.actions'),
        width: '8rem',
        flex: 0,
        align: 'center',
      },
    ];
  });
  protected readonly pageSize = signal(5);
  protected readonly table = createTable<ShowcasePackage>(() => ({
    columns: () => this.columns(),
    data: () => this.packages(),
    locale: () => this.i18n.currentLanguage(),
    pageSize: this.pageSize(),
  }));
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.table.total() / this.pageSize())),
  );
  protected previousPage(): void {
    this.table.page.update((page) => Math.max(0, page - 1));
  }
  protected nextPage(): void {
    this.table.page.update((page) => Math.min(this.pageCount() - 1, page + 1));
  }
  protected changePageSize(value: SelectChange): void {
    if (typeof value !== 'string') return;
    this.pageSizeValue.set(value);
    this.pageSize.set(Number(value));
    this.table.page.set(0);
  }

  protected runAction(action: 'view' | 'edit' | 'delete', row: ShowcasePackage): void {
    if (action === 'delete') {
      this.packages.update((rows) => rows.filter((item) => item.id !== row.id));
      this.actionMessage.set(this.i18n.translate('showcase.table.deleted', { name: row.name }));
      this.table.page.update((page) => Math.min(page, this.pageCount() - 1));
      return;
    }

    if (action === 'edit') {
      this.packages.update((rows) =>
        rows.map((item) =>
          item.id === row.id ? { ...item, status: 'showcase.table.updated' } : item,
        ),
      );
    }
    this.actionMessage.set(
      this.i18n.translate(`showcase.table.${action}Message`, { name: row.name }),
    );
  }
}
