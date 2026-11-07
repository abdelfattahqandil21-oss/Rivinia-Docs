import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { InteractiveShowcaseComponent } from '../../features/showcase/interactive-showcase.component';

type DecisionId = 'api' | 'flexibility' | 'signals' | 'accessibility';
type HomeSectionId = 'hero' | 'experience' | 'decisions' | 'start';

@Component({
  imports: [RouterLink, InteractiveShowcaseComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly copyStatus = signal('');
  protected readonly activeDecision = signal<DecisionId | null>(null);
  protected readonly activeSection = signal<HomeSectionId>('hero');
  protected readonly homeSections: readonly { id: HomeSectionId; labelKey: string }[] = [
    { id: 'hero', labelKey: 'home.section.hero' },
    { id: 'experience', labelKey: 'home.section.experience' },
    { id: 'decisions', labelKey: 'home.section.decisions' },
    { id: 'start', labelKey: 'home.section.start' },
  ];
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
  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view || typeof view.IntersectionObserver !== 'function') {
        return;
      }

      const sections = this.document.querySelectorAll<HTMLElement>('.home-page .home-section');
      const visibility = new Map<HomeSectionId, number>();
      const observer = new view.IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
            const id = entry.target.id;
            if (id === 'hero' || id === 'experience' || id === 'decisions' || id === 'start') {
              visibility.set(id, entry.intersectionRatio);
            }
          }

          let mostVisible: HomeSectionId = this.activeSection();
          let highestRatio = 0;
          for (const [id, ratio] of visibility) {
            if (ratio > highestRatio) {
              mostVisible = id;
              highestRatio = ratio;
            }
          }
          if (highestRatio > 0) {
            this.activeSection.set(mostVisible);
          }
        },
        { threshold: [0, 0.12, 0.35, 0.6, 0.85] },
      );

      sections.forEach((section) => {
        section.classList.add('section-reveal');
        observer.observe(section);
      });
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected setActiveDecision(id: DecisionId | null): void {
    this.activeDecision.set(id);
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
}
