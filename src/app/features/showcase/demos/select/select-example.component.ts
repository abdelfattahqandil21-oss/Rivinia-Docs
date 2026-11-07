import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { RiviniaSelect } from '@rivinia/select';
import type { RiviniaSelectOption } from '@rivinia/select';
import { RiviniaSelectComponent, type SelectChange } from '@rivinia/select/ui';

@Component({
  imports: [RiviniaSelectComponent, RvTranslatePipe],
  selector: 'app-showcase-select-example',
  templateUrl: './select-example.component.html',
  styleUrl: './select-example.component.css',
})
export class SelectExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  readonly viewMode = input<'headless' | 'ui'>('ui');
  readonly selectionMode = input<'single' | 'multi'>('single');
  protected readonly singleValue = signal<SelectChange>(null);
  protected readonly multiValue = signal<SelectChange>([]);
  protected readonly headlessOpen = signal(false);
  protected readonly activeOptionId = signal<string | null>(null);
  private readonly headlessSingle = new RiviniaSelect('single');
  private readonly headlessMulti = new RiviniaSelect('multi');
  protected readonly headlessSelect = computed(() =>
    this.selectionMode() === 'single' ? this.headlessSingle : this.headlessMulti,
  );
  protected readonly options = computed<readonly RiviniaSelectOption[]>(() => {
    this.i18n.currentLanguage();
    return [
      { id: 'accessibility', label: this.i18n.translate('showcase.select.accessibility') },
      { id: 'customization', label: this.i18n.translate('showcase.select.customization') },
      {
        id: 'coming-soon',
        label: this.i18n.translate('showcase.select.disabled'),
        disabled: true,
      },
    ];
  });
  protected readonly filteredOptions = computed(() => this.headlessSelect().filtered());
  protected readonly activeOption = computed(
    () => this.filteredOptions().find((option) => option.id === this.activeOptionId()) ?? null,
  );
  protected readonly activeOptionDomId = computed(() => {
    const option = this.activeOption();
    return option ? this.optionDomId(option.id) : null;
  });
  protected readonly headlessSelectedIds = computed(() => {
    const select = this.headlessSelect();
    const value = select.value();
    return select.mode === 'single' ? (value ? [value] : []) : [...select.values()];
  });
  protected readonly headlessSelectedOptions = computed(() => {
    const options = this.options();
    return this.headlessSelectedIds()
      .map((id) => options.find((option) => option.id === id))
      .filter((option): option is RiviniaSelectOption => option !== undefined);
  });
  protected readonly singleSummary = computed(() => this.labelsFor(this.singleValue()));
  protected readonly multiSummary = computed(() => this.labelsFor(this.multiValue()));

  constructor() {
    effect(() => {
      const options = this.options();
      this.headlessSingle.syncOptions(options);
      this.headlessMulti.syncOptions(options);
    });
  }

  protected setSingleValue(value: SelectChange): void {
    this.singleValue.set(typeof value === 'string' ? value : null);
  }

  protected setMultiValue(value: SelectChange): void {
    this.multiValue.set(Array.isArray(value) ? value : value ? [value] : []);
  }

  protected setUiValue(value: SelectChange): void {
    if (this.selectionMode() === 'single') {
      this.setSingleValue(value);
    } else {
      this.setMultiValue(value);
    }
  }

  protected toggleHeadless(combobox: HTMLInputElement): void {
    if (this.headlessOpen()) {
      this.closeHeadless();
    } else {
      this.openHeadless('selected');
    }
    combobox.focus();
  }

  protected setHeadlessQuery(event: Event): void {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    this.headlessSelect().setQuery(input.value);
    this.headlessOpen.set(true);
    this.activateFirstAvailable();
  }

  protected onHeadlessKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.headlessOpen()) {
        this.moveActiveOption(1);
      } else {
        this.openHeadless('first');
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.headlessOpen()) {
        this.moveActiveOption(-1);
      } else {
        this.openHeadless('last');
      }
    } else if (event.key === 'Enter' && this.headlessOpen()) {
      event.preventDefault();
      const activeOption = this.activeOption();
      if (activeOption && !activeOption.disabled) {
        this.selectHeadlessOption(activeOption.id);
      }
    } else if (event.key === 'Escape' && this.headlessOpen()) {
      event.preventDefault();
      this.closeHeadless();
    }
  }

  protected onHeadlessFocusout(event: FocusEvent): void {
    const root = event.currentTarget;
    const nextTarget = event.relatedTarget;
    if (
      root instanceof HTMLElement &&
      (!(nextTarget instanceof Node) || !root.contains(nextTarget))
    ) {
      this.closeHeadless();
    }
  }

  protected selectHeadlessOption(id: string): void {
    const select = this.headlessSelect();
    const selected = select.mode === 'single' ? select.select(id) : select.toggle(id);
    if (!selected || select.mode !== 'single') {
      return;
    }

    select.clearQuery();
    this.closeHeadless();
  }

  protected removeHeadlessSelection(id: string): void {
    const select = this.headlessSelect();
    if (select.mode === 'single') {
      select.clear();
    } else {
      select.toggle(id);
    }
  }

  protected optionDomId(id: string): string {
    return `headless-option-${id}`;
  }

  protected stopOptionPointerFocus(event: PointerEvent): void {
    event.preventDefault();
  }

  private openHeadless(position: 'first' | 'last' | 'selected'): void {
    const options = this.enabledFilteredOptions();
    const selectedId = this.headlessSelectedIds().find((id) =>
      options.some((option) => option.id === id),
    );
    const activeOption =
      position === 'selected' && selectedId
        ? selectedId
        : position === 'last'
          ? options.at(-1)?.id
          : options[0]?.id;
    this.activeOptionId.set(activeOption ?? null);
    this.headlessOpen.set(true);
  }

  private closeHeadless(): void {
    this.headlessOpen.set(false);
    this.activeOptionId.set(null);
  }

  private activateFirstAvailable(): void {
    this.activeOptionId.set(this.enabledFilteredOptions()[0]?.id ?? null);
  }

  private moveActiveOption(direction: 1 | -1): void {
    const options = this.enabledFilteredOptions();
    if (!options.length) {
      this.activeOptionId.set(null);
      return;
    }

    const currentIndex = options.findIndex((option) => option.id === this.activeOptionId());
    const nextIndex =
      currentIndex < 0
        ? direction === 1
          ? 0
          : options.length - 1
        : (currentIndex + direction + options.length) % options.length;
    this.activeOptionId.set(options[nextIndex]?.id ?? null);
  }

  private enabledFilteredOptions(): readonly RiviniaSelectOption[] {
    return this.filteredOptions().filter((option) => !option.disabled);
  }

  private labelsFor(value: SelectChange): string {
    const ids = Array.isArray(value) ? value : value ? [value] : [];
    return this.options()
      .filter((option) => ids.includes(option.id))
      .map((option) => option.label)
      .join('، ');
  }
}
