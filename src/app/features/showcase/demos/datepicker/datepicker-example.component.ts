import { Component, computed, inject, signal } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import {
  DATEPICKER_LABELS_AR,
  DATEPICKER_LABELS_EN,
  formatDateTime,
  type RiviniaDate,
  type RiviniaDateTime,
  type RiviniaTime,
} from '@rivinia/datepicker';
import {
  RiviniaDatepickerComponent,
  RiviniaDatetimepickerComponent,
  RiviniaTimeRowComponent,
} from '@rivinia/datepicker/ui';

/** Demonstrates date-only, time-only, and combined date/time controls. */
@Component({
  imports: [
    RiviniaDatepickerComponent,
    RiviniaDatetimepickerComponent,
    RiviniaTimeRowComponent,
    RvTranslatePipe,
  ],
  selector: 'app-showcase-datepicker-example',
  templateUrl: './datepicker-example.component.html',
  styleUrl: './datepicker-example.component.css',
})
export class DatepickerExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  /** Follow the language selected in the Docs preferences. */
  protected readonly locale = computed(() => this.i18n.locale());

  /** Use the package's localized calendar labels alongside translated field labels. */
  protected readonly pickerLabels = computed(() =>
    this.locale().startsWith('ar') ? DATEPICKER_LABELS_AR : DATEPICKER_LABELS_EN,
  );

  /** Civil calendar date selected by the date-only control; it has no time zone. */
  protected readonly selectedDate = signal<RiviniaDate | null>({ year: 2026, month: 11, day: 6 });

  /** Time of day selected by the time-only control, stored in 24-hour form. */
  protected readonly selectedTime = signal<RiviniaTime>({ hour: 14, minute: 30, second: 0 });

  /** Civil date and wall time selected by the combined control. */
  protected readonly selectedDateTime = signal<RiviniaDateTime | null>({
    date: { year: 2026, month: 11, day: 6 },
    time: { hour: 14, minute: 30, second: 0 },
  });

  /** Format at UTC midnight so the displayed calendar day cannot shift locally. */
  protected readonly selectedDateLabel = computed(() => {
    const date = this.selectedDate();
    if (!date) {
      return this.i18n.translate('showcase.datepicker.none');
    }

    return new Intl.DateTimeFormat(this.locale(), { dateStyle: 'medium', timeZone: 'UTC' }).format(
      new Date(Date.UTC(date.year, date.month - 1, date.day)),
    );
  });

  /** A fixed UTC date lets Intl format only the selected hours and minutes. */
  protected readonly selectedTimeLabel = computed(() =>
    new Intl.DateTimeFormat(this.locale(), { timeStyle: 'short', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2026, 0, 1, this.selectedTime().hour, this.selectedTime().minute)),
    ),
  );

  /** Format the combined civil value with the package helper. */
  protected readonly selectedDateTimeLabel = computed(() => {
    const dateTime = this.selectedDateTime();
    return dateTime
      ? formatDateTime(this.locale(), dateTime, 'medium', 'short')
      : this.i18n.translate('showcase.datepicker.none');
  });
}
