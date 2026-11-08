import { Component, signal } from '@angular/core';
import { RiviniaSelectComponent } from '@rivinia/select/ui';

@Component({
  imports: [RiviniaSelectComponent],
  template: `
    <section class="demo-card" aria-labelledby="theme-css-title">
      <h4 id="theme-css-title">A shared palette, one UI component</h4>
      <p>The real Select UI reads its component token, then the shared palette.</p>
      <rv-select
        label="Choose a surface"
        placeholder="Select a surface"
        [options]="options"
        [searchable]="true"
        [(value)]="selected"
      />
      <p class="selection" aria-live="polite">Selected value: {{ selected() || 'none' }}</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
      color: var(--rv-fg);
      font: 1rem/1.5 var(--rv-font);
    }

    .demo-card {
      display: grid;
      max-inline-size: 34rem;
      gap: 0.75rem;
      margin-inline: auto;
      padding: 1.25rem;
      border: 1px solid var(--rv-border);
      border-radius: var(--rv-radius);
      color: var(--rv-fg);
      background: var(--rv-bg);
      box-shadow: var(--rv-shadow);
    }

    h4,
    p {
      margin: 0;
    }

    .selection {
      color: var(--rv-muted);
    }
  `,
})
export default class ThemeCssConsumerExample {
  protected readonly options = [
    { id: 'surface', label: 'Surface' },
    { id: 'accent', label: 'Accent' },
    { id: 'status', label: 'Status' },
  ];
  protected readonly selected = signal<string | null>(null);
}
