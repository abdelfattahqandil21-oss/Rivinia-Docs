import { ComponentFixture, TestBed } from '@angular/core/testing';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { beforeEach, describe, expect, it } from 'vitest';

import { SelectExampleComponent } from './select-example.component';

const translations = {
  'showcase.select.label': 'Choose capabilities',
  'showcase.select.singlePlaceholder': 'Choose one',
  'showcase.select.multiPlaceholder': 'Choose one or more',
  'showcase.select.search': 'Search capabilities',
  'showcase.select.accessibility': 'Accessible patterns',
  'showcase.select.customization': 'Flexible styling',
  'showcase.select.disabled': 'Coming soon',
  'showcase.select.selected': 'Selected',
  'showcase.select.noMatches': 'No options match your search.',
  'showcase.select.removeSelection': 'Remove {label}',
  'showcase.select.openOptions': 'Show options',
  'showcase.select.closeOptions': 'Hide options',
  'showcase.select.options': 'Select options',
  'showcase.select.stateTitle': 'State from headless layer',
  'showcase.select.stateField': 'State',
  'showcase.select.stateValue': 'Value',
  'showcase.select.stateTable': 'Headless Select state',
  'showcase.select.stateOpen': 'Open',
  'showcase.select.stateActiveOption': 'Active option',
  'showcase.select.stateSelectedIds': 'Selected IDs',
  'showcase.select.noActiveOption': 'None',
  'showcase.select.headless.singleTitle': 'Single selection · headless',
  'showcase.select.headless.singleDescription': 'Custom single dropdown',
  'showcase.select.headless.multiTitle': 'Multiple selection · headless',
  'showcase.select.headless.multiDescription': 'Custom multi dropdown',
};

describe('SelectExampleComponent headless demo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectExampleComponent],
      providers: [
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    }).compileComponents();
  });

  async function createFixture(
    mode: 'single' | 'multi',
  ): Promise<ComponentFixture<SelectExampleComponent>> {
    const fixture = TestBed.createComponent(SelectExampleComponent);
    fixture.componentRef.setInput('viewMode', 'headless');
    fixture.componentRef.setInput('selectionMode', mode);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function key(fixture: ComponentFixture<SelectExampleComponent>, value: string): void {
    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    combobox.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true }));
    fixture.detectChanges();
  }

  it('navigates enabled options and keeps multi selection open with removable chips', async () => {
    const fixture = await createFixture('multi');
    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;

    key(fixture, 'ArrowDown');
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.headless-option.is-active').textContent).toContain(
      'Accessible patterns',
    );

    key(fixture, 'ArrowDown');
    expect(fixture.nativeElement.querySelector('.headless-option.is-active').textContent).toContain(
      'Flexible styling',
    );
    key(fixture, 'ArrowDown');
    expect(fixture.nativeElement.querySelector('.headless-option.is-active').textContent).toContain(
      'Accessible patterns',
    );

    key(fixture, 'Enter');
    fixture.detectChanges();
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.headless-state').textContent).toContain(
      'accessibility',
    );
    expect(
      fixture.nativeElement.querySelector('[aria-label="Remove Accessible patterns"]'),
    ).not.toBeNull();

    (
      fixture.nativeElement.querySelector(
        '[aria-label="Remove Accessible patterns"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.headless-state').textContent).toContain('—');
    expect(fixture.nativeElement.querySelector('.selected-chips')).toBeNull();
  });

  it('selects one option and closes the single-selection list', async () => {
    const fixture = await createFixture('single');
    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;

    key(fixture, 'ArrowDown');
    key(fixture, 'Enter');

    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.headless-state').textContent).toContain(
      'accessibility',
    );
    expect(fixture.nativeElement.querySelector('.headless-option.is-active')).toBeNull();
  });

  it('filters with the package controller and clears active state on Escape', async () => {
    const fixture = await createFixture('multi');
    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    combobox.value = 'flexible';
    combobox.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[role="option"]')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('.headless-option.is-active').textContent).toContain(
      'Flexible styling',
    );

    key(fixture, 'Escape');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.headless-option.is-active')).toBeNull();
  });

  it('renders live headless state as a compact Rivinia table', async () => {
    const fixture = await createFixture('single');
    const state = fixture.nativeElement.querySelector('.headless-state');

    expect(state.querySelector('rv-table')).not.toBeNull();
    expect(state.querySelector('rv-table')?.getAttribute('data-sticky')).toBe('false');
    expect(state.textContent).toContain('State');
    expect(state.textContent).toContain('Open');
    expect(state.textContent).toContain('false');
  });

  it('closes the list when keyboard focus leaves the headless control', async () => {
    const fixture = await createFixture('multi');
    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    const nextControl = document.createElement('button');
    document.body.append(nextControl);

    combobox.focus();
    key(fixture, 'ArrowDown');
    nextControl.focus();
    fixture.detectChanges();

    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    nextControl.remove();
  });
});
