import { Component, computed, inject, signal } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import type { RiviniaDate } from '@rivinia/datepicker';
import { RiviniaDatepickerComponent } from '@rivinia/datepicker/ui';

@Component({
  imports: [RiviniaDatepickerComponent, RvTranslatePipe],
  selector: 'app-showcase-datepicker-example',
  templateUrl: './datepicker-example.component.html',
  styleUrl: './datepicker-example.component.css',
})
export class DatepickerExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly locale = computed(() => this.i18n.locale());
  protected readonly selectedDate = signal<RiviniaDate | null>({ year: 2026, month: 11, day: 6 });
  protected readonly selectedDateLabel = computed(() => {
    const date = this.selectedDate();
    if (!date) {
      return this.i18n.translate('showcase.datepicker.none');
    }

    return new Intl.DateTimeFormat(this.locale(), { dateStyle: 'medium', timeZone: 'UTC' }).format(
      new Date(Date.UTC(date.year, date.month - 1, date.day)),
    );
  });
}
