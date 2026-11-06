import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaSelectComponent } from '@rivinia/select/ui';
import type { RiviniaSelectOption } from '@rivinia/select';
import { RiviniaI18n } from '@rivinia/i18n';

import { BrandMarkComponent } from '../../shared/components/brand-mark/brand-mark.component';

type Pillar = 'simplicity' | 'flexibility' | 'performance' | 'accessibility';

@Component({
  imports: [RouterLink, RiviniaSelectComponent, BrandMarkComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected readonly title = this.i18n.t('page.home.title');
  protected readonly lead = this.i18n.t('page.home.lead');
  protected readonly primaryCta = this.i18n.t('page.home.primaryCta');
  protected readonly secondaryCta = this.i18n.t('page.home.secondaryCta');
  protected readonly selectLabel = this.i18n.t('home.select.label');
  protected readonly selectPlaceholder = this.i18n.t('home.select.placeholder');
  protected readonly selectOptions = computed<readonly RiviniaSelectOption[]>(() => {
    this.i18n.currentLanguage();
    return [
      { id: 'accessible', label: this.i18n.translate('home.select.accessible') },
      { id: 'customizable', label: this.i18n.translate('home.select.customizable') },
      { id: 'performant', label: this.i18n.translate('home.select.performant') },
    ];
  });
  protected readonly selectedValue = signal<string | null>(null);
  protected readonly selectedPillar = signal<Pillar>('simplicity');
  protected readonly selectedLabel = computed(() => {
    this.i18n.currentLanguage();
    const id = this.selectedValue();
    return id ? this.i18n.translate(`home.select.${id}`) : null;
  });
  protected readonly pillars: readonly Pillar[] = [
    'simplicity', 'flexibility', 'performance', 'accessibility',
  ];
  protected selectPillar(pillar: Pillar): void {
    this.selectedPillar.set(pillar);
  }

  protected pillarTitle(pillar: Pillar): string {
    return this.i18n.translate(`home.pillar.${pillar}.title`);
  }

  protected pillarDescription(pillar: Pillar): string {
    return this.i18n.translate(`home.pillar.${pillar}.text`);
  }

  protected updateSelection(value: string | readonly string[] | null): void {
    this.selectedValue.set(typeof value === 'string' ? value : null);
  }
}
