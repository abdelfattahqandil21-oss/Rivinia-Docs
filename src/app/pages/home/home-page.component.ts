import { DOCUMENT } from '@angular/common';
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
  private readonly document = inject(DOCUMENT);

  protected readonly copyStatus = signal('');
  protected readonly headlessSnippet = `import { RiviniaSelect } from '@rivinia/select';

const select = new RiviniaSelect('multi');
select.syncOptions(options);
select.toggle(option.id);`;
  protected readonly uiSnippet = `<rv-select
  mode="single"
  [options]="options()"
  [label]="'Choose capabilities'"
  [searchable]="true"
  [value]="singleValue()"
  (valueChange)="singleValue.set($event)"
/>`;
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

  protected async copyInstall(): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) {
      this.copyStatus.set(this.i18n.translate('home.copyError'));
      return;
    }

    try {
      await clipboard.writeText('npm i @rivinia/select');
      this.copyStatus.set(this.i18n.translate('home.copySuccess'));
    } catch {
      this.copyStatus.set(this.i18n.translate('home.copyError'));
    }
  }

  protected pillarTitle(pillar: Pillar): string {
    return this.i18n.translate(`home.pillar.${pillar}.title`);
  }

  protected pillarDescription(pillar: Pillar): string {
    return this.i18n.translate(`home.pillar.${pillar}.text`);
  }
}
