import type { ShowcaseCodeGroup } from '../../showcase-example.model';

const sourceFile = (
  prefix: 'date' | 'time' | 'datetime',
  id: 'typescript' | 'html' | 'css',
  code: string,
): ShowcaseCodeGroup['files'][number] => ({
  id,
  name: `${prefix}-example.component.${id === 'typescript' ? 'ts' : id}`,
  language: id === 'typescript' ? 'ts' : id,
  code,
});

export const DATEPICKER_CODE_GROUPS: readonly ShowcaseCodeGroup[] = [
  {
    id: 'date',
    titleKey: 'showcase.datepicker.code.date',
    files: [
      sourceFile(
        'date',
        'html',
        `<rv-datepicker
  [(value)]="selectedDate"
  [locale]="locale()"
  format="medium"
  [labels]="pickerLabels()"
  [label]="'Choose a date'"
  [clearable]="true"
/>`,
      ),
      sourceFile(
        'date',
        'typescript',
        `import { signal } from '@angular/core';
import { todayInTimeZone, type RiviniaDate } from '@rivinia/datepicker';

readonly selectedDate = signal<RiviniaDate | null>(
  todayInTimeZone('Africa/Cairo'),
);`,
      ),
      sourceFile(
        'date',
        'css',
        `.date-example {
  display: grid;
  gap: 0.75rem;
  max-inline-size: 24rem;
}`,
      ),
    ],
  },
  {
    id: 'time',
    titleKey: 'showcase.datepicker.code.time',
    files: [
      sourceFile(
        'time',
        'html',
        `<rv-time-row
  [value]="selectedTime()"
  (valueChange)="selectedTime.set($event)"
  (now)="setCurrentTime()"
  [locale]="locale()"
  [labels]="pickerLabels()"
  [hour12]="'auto'"
  [showSeconds]="false"
/>`,
      ),
      sourceFile(
        'time',
        'typescript',
        `import { signal } from '@angular/core';
import { nowInTimeZone, type RiviniaTime } from '@rivinia/datepicker';

readonly selectedTime = signal<RiviniaTime>({
  hour: 14,
  minute: 30,
  second: 0,
});

setCurrentTime(): void {
  this.selectedTime.set(nowInTimeZone('Africa/Cairo').time);
}`,
      ),
      sourceFile(
        'time',
        'css',
        `.time-example {
  display: grid;
  gap: 0.75rem;
}

rv-time-row {
  max-inline-size: 32rem;
}`,
      ),
    ],
  },
  {
    id: 'datetime',
    titleKey: 'showcase.datepicker.code.dateTime',
    files: [
      sourceFile(
        'datetime',
        'html',
        `<rv-datetimepicker
  [(value)]="selectedDateTime"
  [locale]="locale()"
  format="medium"
  timeFormat="short"
  timeZone="Africa/Cairo"
  [labels]="pickerLabels()"
  [label]="'Choose date and time'"
  [clearable]="true"
/>`,
      ),
      sourceFile(
        'datetime',
        'typescript',
        `import { signal } from '@angular/core';
import { nowInTimeZone, type RiviniaDateTime } from '@rivinia/datepicker';

readonly selectedDateTime = signal<RiviniaDateTime | null>({
  date: nowInTimeZone('Africa/Cairo').date,
  time: { hour: 14, minute: 30, second: 0 },
});`,
      ),
      sourceFile(
        'datetime',
        'css',
        `.datetime-example {
  display: grid;
  gap: 0.75rem;
  max-inline-size: 24rem;
}

@media (max-width: 40rem) {
  .datetime-example {
    max-inline-size: 100%;
  }
}`,
      ),
    ],
  },
];
