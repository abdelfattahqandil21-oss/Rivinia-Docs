import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { BrandMarkComponent } from '../../shared/components/brand-mark/brand-mark.component';
import { InteractiveShowcaseComponent } from '../../features/showcase/interactive-showcase.component';

type Pillar = 'simplicity' | 'flexibility' | 'performance' | 'accessibility';

@Component({
  imports: [RouterLink, BrandMarkComponent, InteractiveShowcaseComponent],
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
  protected readonly selectedPillar = signal<Pillar>('simplicity');
  protected readonly pillars: readonly Pillar[] = [
    'simplicity',
    'flexibility',
    'performance',
    'accessibility',
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
}
